require "test_helper"

class BulkImportEmployeesJobTest < ActiveJob::TestCase
  setup do
    @user = users(:one)
    @organization = organizations(:acme)
    ActionMailer::Base.deliveries.clear
  end

  test "creates tmp/user_id/import.log, logs true/false per row, emails user, and removes file" do
    # CSV with:
    # Row 1: Valid employee
    # Row 2: Incomplete info (missing email and salary)
    # Row 3: Valid employee
    csv_data = <<~CSV
      id,first_name,last_name,email,job_title,department,country,salary
      101,John,Doe,john.doe.import_test@acme.com,Software Engineer,Engineering,United States,120000
      102,Jane,Smith,,,,Canada,
      103,Alice,Wonderland,alice.wonder.import_test@acme.com,Product Manager,Product,United Kingdom,110000
    CSV

    user_log_path = Rails.root.join("tmp", @user.id.to_s, "import.log")

    # Ensure log file doesn't exist before test
    File.delete(user_log_path) if File.exist?(user_log_path)

    # Execute job and verify email was dispatched to logged-in user
    assert_emails 1 do
      assert_difference("Employee.count", 2) do
        BulkImportEmployeesJob.perform_now(
          csv_content: csv_data,
          user_id: @user.id,
          organization_id: @organization.id
        )
      end
    end

    # Verify log file was deleted after completion
    refute File.exist?(user_log_path), "import.log should be removed after job completes"

    mail = ActionMailer::Base.deliveries.last

    assert_equal [@user.email], mail.to
    assert_includes mail.subject, "Import Log"

    # Verify attached import.log file in the email
    log_attachment = mail.attachments["import.log"]
    assert log_attachment.present?, "Email must have import.log attached"

    log_content = log_attachment.body.to_s
    assert_includes log_content, "Row ID 101: true"
    assert_includes log_content, "Row ID 102: false - Missing required fields: email, job_title, department, salary"
    assert_includes log_content, "Row ID 103: true"
  end

  test "logs false when duplicate email causes rollback" do
    dupe_user = users(:two)
    # Create existing employee
    existing = Employee.create!(
      organization: @organization,
      first_name: "Existing",
      last_name: "Employee",
      email: "duplicate.email@acme.com",
      job_title: "Developer",
      department: "Engineering",
      country: "United States",
      salary: 100000
    )

    csv_data = <<~CSV
      first_name,last_name,email,job_title,department,country,salary
      New,Employee,new.unique@acme.com,Designer,Design,United States,90000
      Dupe,Employee,duplicate.email@acme.com,Developer,Engineering,United States,95000
    CSV

    user_log_path = Rails.root.join("tmp", dupe_user.id.to_s, "import.log")

    assert_difference("Employee.count", 1) do
      BulkImportEmployeesJob.perform_now(
        csv_content: csv_data,
        user_id: dupe_user.id,
        organization_id: @organization.id
      )
    end

    refute File.exist?(user_log_path)

    mail = ActionMailer::Base.deliveries.last
    log_attachment = mail.attachments["import.log"]
    log_content = log_attachment.body.to_s

    # Row 1 succeeded (row_num 1)
    assert_includes log_content, "Row ID 1: true"
    # Row 2 failed due to duplicate email uniqueness violation (row_num 2)
    assert_includes log_content, "Row ID 2: false - Email has already been taken"
  end
end
