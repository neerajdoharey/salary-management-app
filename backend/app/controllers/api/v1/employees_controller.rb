module Api
  module V1
    class EmployeesController < BaseController
      before_action :set_employee, only: %i[show update destroy]

      # GET /api/v1/employees
      def index
        employees = employees_scope.by_country(params[:country])
                                    .by_department(params[:department])
                                    .by_salary_range(params[:min_salary], params[:max_salary])
                                    .search_query(params[:search])

        sort_column = %w[first_name last_name salary department country].include?(params[:sort_by]) ? params[:sort_by] : "created_at"
        sort_direction = %w[asc desc].include?(params[:sort_order]) ? params[:sort_order] : "desc"

        employees = employees.order(sort_column => sort_direction)
                             .page(params[:page] || 1)
                             .per(params[:per_page] || 25)

        render json: {
          employees: employees,
          meta: {
            current_page: employees.current_page,
            next_page: employees.next_page,
            prev_page: employees.prev_page,
            total_pages: employees.total_pages,
            total_count: employees.total_count
          }
        }
      end

      # GET /api/v1/employees/:id
      def show
        render json: @employee
      end

      # POST /api/v1/employees
      def create
        employee = employees_scope.new(employee_params)
        employee.organization = Current.organization if Current.organization.present?

        if employee.save
          render json: employee, status: :created
        else
          render json: { errors: employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/employees/:id
      def update
        if @employee.update(employee_params)
          render json: @employee
        else
          render json: { errors: @employee.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/employees/:id
      def destroy
        @employee.destroy
        head :no_content
      end

      # POST /api/v1/employees/import
      def import
        unless params[:file].present?
          render json: { error: "No CSV file provided" }, status: :bad_request
          return
        end

        file = params[:file]
        user = Current.user
        org_id = Current.organization&.id

        temp_dir = Rails.root.join("tmp", "imports")
        FileUtils.mkdir_p(temp_dir)
        temp_file_path = temp_dir.join("#{SecureRandom.uuid}.csv")
        File.binwrite(temp_file_path, file.read)

        if params[:sync] == "true" || params[:sync] == true
          BulkImportEmployeesJob.perform_now(
            file_path: temp_file_path.to_s,
            user_id: user&.id,
            organization_id: org_id
          )
          render json: {
            message: "Import complete",
            status: "completed"
          }, status: :ok
        else
          job = BulkImportEmployeesJob.perform_later(
            file_path: temp_file_path.to_s,
            user_id: user&.id,
            organization_id: org_id
          )

          render json: {
            message: "Bulk import process started in background. A log file will be emailed upon completion.",
            status: "processing",
            job_id: job.job_id,
            imported_count: 0,
            error_count: 0
          }, status: :accepted
        end
      rescue => e
        render json: { error: "Failed to start bulk import: #{e.message}" }, status: :unprocessable_entity
      end

      private

      def employees_scope
        Current.organization.present? ? Current.organization.employees : Employee.all
      end

      def set_employee
        @employee = employees_scope.find(params[:id])
      end

      def employee_params
        p = params[:employee].is_a?(ActionController::Parameters) || params[:employee].is_a?(Hash) ? params.require(:employee) : params
        p.permit(:first_name, :last_name, :email, :job_title, :department, :country, :salary)
      end
    end
  end
end
