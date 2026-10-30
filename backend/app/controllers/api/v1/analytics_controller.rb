module Api
  module V1
    class AnalyticsController < BaseController
      # GET /api/v1/analytics
      def index
        employees = Current.organization.present? ? Current.organization.employees : Employee.all

        total_payroll = employees.sum(:salary)
        avg_salary = employees.average(:salary)&.round(2) || 0
        total_count = employees.count

        country_stats = employees.group(:country)
                                 .select("country, COUNT(*) as count, AVG(salary) as avg_salary, SUM(salary) as total_payroll")
                                 .order("total_payroll DESC")
                                 .as_json(except: :id)

        department_stats = employees.group(:department)
                                     .select("department, COUNT(*) as count, AVG(salary) as avg_salary, SUM(salary) as total_payroll")
                                     .order("total_payroll DESC")
                                     .as_json(except: :id)

        render json: {
          summary: {
            total_payroll: total_payroll,
            average_salary: avg_salary,
            total_employees: total_count
          },
          by_country: country_stats,
          by_department: department_stats
        }
      end
    end
  end
end
