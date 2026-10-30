require "test_helper"

class MissionControlJobsAuthenticationTest < ActionDispatch::IntegrationTest
  setup do
    @admin = users(:one)       # role: admin, password: Password@12345
    @hr_user = users(:two)     # role: hr_manager, password: Password@12345

    ActiveJob::QueueAdapters::SolidQueueAdapter.prepend(ActiveJob::QueueAdapters::SolidQueueExt) unless ActiveJob::QueueAdapters::SolidQueueAdapter < ActiveJob::QueueAdapters::SolidQueueExt
    @server = MissionControl::Jobs.applications["backend"].servers.to_a.first
    @original_adapter = @server.instance_variable_get(:@queue_adapter)
    @server.instance_variable_set(:@queue_adapter, ActiveJob::QueueAdapters::SolidQueueAdapter.new)
  end

  teardown do
    @server.instance_variable_set(:@queue_adapter, @original_adapter) if @server
  end

  test "blocks unauthenticated access to /jobs" do
    get "/jobs"
    assert_response :unauthorized
    assert_includes response.headers["WWW-Authenticate"], 'Basic realm="Mission Control Jobs"'
  end

  test "blocks access with invalid credentials" do
    get "/jobs", headers: {
      "HTTP_AUTHORIZATION" => ActionController::HttpAuthentication::Basic.encode_credentials("admin", "wrong_password")
    }
    assert_response :unauthorized
  end

  test "allows access with configured mission control basic auth credentials" do
    get "/jobs", headers: {
      "HTTP_AUTHORIZATION" => ActionController::HttpAuthentication::Basic.encode_credentials("admin", "Password@12345")
    }
    assert_response :ok
  end

  test "allows access with admin database user credentials" do
    get "/jobs", headers: {
      "HTTP_AUTHORIZATION" => ActionController::HttpAuthentication::Basic.encode_credentials(@admin.email, "Password@12345")
    }
    assert_response :ok
  end

  test "blocks access with non-admin database user credentials" do
    get "/jobs", headers: {
      "HTTP_AUTHORIZATION" => ActionController::HttpAuthentication::Basic.encode_credentials(@hr_user.email, "Password@12345")
    }
    assert_response :unauthorized
  end
end
