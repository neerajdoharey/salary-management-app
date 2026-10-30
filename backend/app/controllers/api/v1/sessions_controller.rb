module Api
  module V1
    class SessionsController < BaseController
      skip_before_action :authenticate, only: :create

      def create
        if user = User.authenticate_by(email: params[:email], password: params[:password])
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
          render json: { error: "Invalid email or password" }, status: :unauthorized
        end
      end

      def destroy
        Current.session&.destroy
        render json: { message: "Signed out successfully" }, status: :ok
      end
    end
  end
end
