require "csv"
require "fileutils"

class BulkImportEmployeesJob < ApplicationJob
  queue_as :default

  def perform(*args, **kwargs)
    # Parse flexible arguments (keyword args, options hash, or positional arguments)
    file_path, csv_content, user_id, organization_id = extract_arguments(args, kwargs)

    user = user_id.is_a?(User) ? user_id : User.find_by(id: user_id)
    user_id = user&.id || user_id
    organization_id = organization_id || user&.organization_id

    # Create user-specific subdirectory within Rails tmp/ directory (e.g., tmp/user_id/import.log)
    log_dir = Rails.root.join("tmp", user_id.to_s)
    FileUtils.mkdir_p(log_dir)
    log_path = log_dir.join("import.log")

    # Start the background process and create import.log file immediately
    log_file = File.open(log_path, "w")
    log_file.sync = true

    begin
      raw_csv = csv_content || (file_path && File.exist?(file_path) ? File.read(file_path) : "")
      rows = CSV.parse(raw_csv, headers: true)

      rows.each_with_index do |row, index|
        row_num = index + 1
        row_id = row["id"].presence || row["row_id"].presence || row["ID"].presence || row_num

        first_name = row["first_name"]&.strip
        last_name  = row["last_name"]&.strip
        email      = row["email"]&.strip
        job_title  = row["job_title"]&.strip
        department = row["department"]&.strip
        country    = row["country"]&.strip
        salary_raw = row["salary"]

        missing_fields = []
        missing_fields << "first_name" if first_name.blank?
        missing_fields << "last_name" if last_name.blank?
        missing_fields << "email" if email.blank?
        missing_fields << "job_title" if job_title.blank?
        missing_fields << "department" if department.blank?
        missing_fields << "country" if country.blank?
        missing_fields << "salary" if salary_raw.blank?

        success = false
        error_message = nil

        if missing_fields.any?
          success = false
          error_message = "Missing required fields: #{missing_fields.join(', ')}"
        else
          begin
            ActiveRecord::Base.transaction do
              employee = Employee.new(
                organization_id: organization_id,
                first_name: first_name,
                last_name: last_name,
                email: email,
                job_title: job_title,
                department: department,
                country: country,
                salary: salary_raw.to_s.strip.to_f
              )

              if employee.save
                success = true
              else
                success = false
                error_message = employee.errors.full_messages.join(", ")
                raise ActiveRecord::Rollback
              end
            end
          rescue StandardError => e
            success = false
            error_message ||= e.message
          end
        end

        # Log row ID along with boolean flag and error message if failed
        if success
          log_file.puts "Row ID #{row_id}: true"
        else
          log_file.puts "Row ID #{row_id}: false - #{error_message}"
        end
      end

      # Flush and close before emailing
      log_file.close

      # After import completes, email log file to the logged-in user
      if user.present? && File.exist?(log_path)
        ImportMailer.import_completed(user, log_path.to_s).deliver_now
      end
    ensure
      # Close file if still open
      log_file.close if log_file && !log_file.closed?

      # Remove the log file after completion as requested
      if File.exist?(log_path)
        File.delete(log_path) rescue nil
      end

      # Clean up empty user directory and uploaded temp file if present
      Dir.rmdir(log_dir) rescue nil
      if file_path.present? && File.exist?(file_path)
        File.delete(file_path) rescue nil
      end
    end
  end

  private

  def extract_arguments(args, kwargs)
    if kwargs.present?
      [kwargs[:file_path], kwargs[:csv_content], kwargs[:user_id], kwargs[:organization_id]]
    elsif args.first.is_a?(Hash)
      opts = args.first.with_indifferent_access
      [opts[:file_path], opts[:csv_content], opts[:user_id], opts[:organization_id]]
    else
      [args[0], nil, args[1], args[2]]
    end
  end
end

# Alias for convenience
BulkImportJob = BulkImportEmployeesJob unless defined?(BulkImportJob)
