module Api
  module V1
    class RegistrationsController < BaseController
      skip_before_action :authenticate, only: :create

      def create
        ActiveRecord::Base.transaction do
          user = User.new(user_params)
          user.verified = true

          if params[:organization_name].present?
            org = Organization.find_or_create_by!(name: params[:organization_name])
            user.organization = org
            # Initial registrant for a new organization defaults to "admin" role if not specified
            user.role = params[:role].presence || "admin"
          elsif default_org = Organization.first
            user.organization = default_org
            user.role = params[:role].presence || "hr_manager"
          else
            user.role = params[:role].presence || "hr_manager"
          end

          if user.save
            session_record = user.sessions.create!
            token = session_record.signed_id
            response.set_header "X-Session-Token", token

            render json: {
              token: token,
              user: {
                id: user.id,
                email: user.email,
                role: user.role,
                organization: user.organization ? {
                  id: user.organization.id,
                  name: user.organization.name,
                  slug: user.organization.slug
                } : nil
              }
            }, status: :created
          else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
            raise ActiveRecord::Rollback
          end
        end
      end

      private

      def user_params
        params.permit(:email, :password, :password_confirmation)
      end
    end
  end
end
