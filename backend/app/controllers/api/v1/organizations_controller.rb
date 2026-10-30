module Api
  module V1
    class OrganizationsController < BaseController
      skip_before_action :authenticate, only: :validate

      # GET /api/v1/organizations/validate?name=Acme+Corp
      def validate
        name = params[:name]&.strip

        if name.blank?
          render json: { error: "Parameter 'name' is required" }, status: :bad_request
          return
        end

        slug = name.parameterize
        org = Organization.find_by("LOWER(name) = ? OR slug = ?", name.downcase, slug)

        if org
          render json: {
            name: org.name,
            slug: org.slug,
            exists: true,
            available: false,
            message: "An organization with this name already exists"
          }, status: :ok
        else
          render json: {
            name: name,
            slug: slug,
            exists: false,
            available: true,
            message: "Organization name is available"
          }, status: :ok
        end
      end
    end
  end
end
