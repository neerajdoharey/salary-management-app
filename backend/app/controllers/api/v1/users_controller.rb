module Api
  module V1
    class UsersController < BaseController
      before_action :require_admin, except: %i[me]
      before_action :set_user, only: %i[show update destroy]

      # GET /api/v1/me
      def me
        render json: {
          user: {
            id: Current.user.id,
            email: Current.user.email,
            role: Current.user.role,
            organization: Current.organization ? {
              id: Current.organization.id,
              name: Current.organization.name,
              slug: Current.organization.slug
            } : nil
          }
        }
      end

      # GET /api/v1/users
      def index
        users = users_scope
        render json: users.map { |u| { id: u.id, email: u.email, role: u.role, created_at: u.created_at } }
      end

      # GET /api/v1/users/:id
      def show
        render json: {
          user: {
            id: @user.id,
            email: @user.email,
            role: @user.role,
            organization_id: @user.organization_id,
            created_at: @user.created_at
          }
        }
      end

      # POST /api/v1/users (Admin creates new team member user in their org)
      def create
        user = users_scope.new(new_user_params)
        user.organization = Current.organization
        user.verified = true

        if user.save
          render json: {
            user: {
              id: user.id,
              email: user.email,
              role: user.role,
              organization_id: user.organization_id
            }
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # PATCH/PUT /api/v1/users/:id
      def update
        if @user.update(update_user_params)
          render json: {
            user: {
              id: @user.id,
              email: @user.email,
              role: @user.role,
              organization_id: @user.organization_id
            }
          }
        else
          render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      # DELETE /api/v1/users/:id
      def destroy
        if @user.id == Current.user.id
          render json: { error: "Cannot delete your own account" }, status: :unprocessable_entity
          return
        end

        @user.destroy
        head :no_content
      end

      private

      def users_scope
        Current.organization ? Current.organization.users : User.all
      end

      def set_user
        @user = users_scope.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "User not found" }, status: :not_found
      end

      def new_user_params
        p = if params[:user].is_a?(ActionController::Parameters)
              user_p = params.require(:user)
              user_p[:password] ||= params[:password] if params[:password].present?
              user_p[:password_confirmation] ||= params[:password_confirmation] if params[:password_confirmation].present?
              user_p
            else
              params
            end
        p.permit(:email, :password, :password_confirmation, :role)
      end

      def update_user_params
        p = if params[:user].is_a?(ActionController::Parameters)
              params.require(:user)
            else
              params
            end
        p.permit(:email, :role, :password, :password_confirmation)
      end

      def require_admin
        unless Current.user&.admin?
          render json: { error: "Access denied. Admin privileges required." }, status: :forbidden
        end
      end
    end
  end
end
