# Configure Mission Control Jobs
Rails.application.configure do
  # Enable HTTP Basic Authentication for Mission Control UI
  MissionControl::Jobs.http_basic_auth_enabled = true
  MissionControl::Jobs.http_basic_auth_user = ENV.fetch("MISSION_CONTROL_USER", "admin")
  MissionControl::Jobs.http_basic_auth_password = ENV.fetch("MISSION_CONTROL_PASSWORD", "Password@12345")
end

Rails.application.config.to_prepare do
  MissionControl::Jobs::ApplicationController.class_eval do
    private

    def authenticate_by_http_basic
      return unless http_basic_authentication_enabled?

      authenticate_or_request_with_http_basic("Mission Control Jobs") do |username, password|
        # 1. Match configured mission control HTTP basic auth credentials
        configured_user = MissionControl::Jobs.http_basic_auth_user.presence
        configured_pass = MissionControl::Jobs.http_basic_auth_password.presence

        matched_configured = if configured_user && configured_pass
          ActiveSupport::SecurityUtils.secure_compare(username.to_s, configured_user) &
            ActiveSupport::SecurityUtils.secure_compare(password.to_s, configured_pass)
        else
          false
        end

        # 2. Or authenticate as an existing admin User from the database
        matched_admin_user = begin
          user = User.find_by(email: username.to_s.strip.downcase)
          (user&.authenticate(password.to_s)&.admin? || false)
        rescue StandardError
          false
        end

        matched_configured || matched_admin_user
      end
    end
  end
end
