require "test_helper"

class Api::V1::UsersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @admin = users(:one) # role: admin
    @hr_user = users(:two) # role: hr_manager
    @admin_headers = auth_headers_for(@admin)
    @hr_headers = auth_headers_for(@hr_user)
  end

  test "should return current user profile with role and organization when authenticated" do
    get api_v1_me_url, headers: @admin_headers
    assert_response :ok

    json = JSON.parse(response.body)
    assert_equal @admin.id, json["user"]["id"]
    assert_equal @admin.email, json["user"]["email"]
    assert_equal "admin", json["user"]["role"]
    assert_equal "ACME Corp", json["user"]["organization"]["name"]
  end

  test "should return current user profile with role and organization when authenticated as hr_manager" do
    get api_v1_me_url, headers: @hr_headers
    assert_response :ok

    json = JSON.parse(response.body)
    assert_equal @hr_user.id, json["user"]["id"]
    assert_equal @hr_user.email, json["user"]["email"]
    assert_equal "hr_manager", json["user"]["role"]
    assert_equal "ACME Corp", json["user"]["organization"]["name"]
  end

  test "should allow admin to list organization users" do
    get api_v1_users_url, headers: @admin_headers
    assert_response :ok

    json = JSON.parse(response.body)
    assert json.is_a?(Array)
    assert json.any? { |u| u["email"] == @admin.email }
  end

  test "should deny non-admin user from listing users" do
    get api_v1_users_url, headers: @hr_headers
    assert_response :forbidden

    json = JSON.parse(response.body)
    assert_equal "Access denied. Admin privileges required.", json["error"]
  end

  test "should allow admin to show user" do
    get api_v1_user_url(@hr_user), headers: @admin_headers
    assert_response :ok

    json = JSON.parse(response.body)
    assert_equal @hr_user.id, json["user"]["id"]
    assert_equal @hr_user.email, json["user"]["email"]
  end

  test "should deny non-admin user from showing user" do
    get api_v1_user_url(@hr_user), headers: @hr_headers
    assert_response :forbidden

    json = JSON.parse(response.body)
    assert_equal "Access denied. Admin privileges required.", json["error"]
  end

  test "should allow admin to create new team member user in their organization" do
    assert_difference("User.count", 1) do
      post api_v1_users_url, params: {
        email: "new.hr@acme.com",
        password: "Password@12345",
        password_confirmation: "Password@12345",
        role: "hr_manager"
      }, headers: @admin_headers
    end

    assert_response :created
    json = JSON.parse(response.body)
    assert_equal "new.hr@acme.com", json["user"]["email"]
    assert_equal "hr_manager", json["user"]["role"]
    assert_equal @admin.organization_id, json["user"]["organization_id"]
  end

  test "should deny non-admin user from creating users" do
    assert_no_difference("User.count") do
      post api_v1_users_url, params: {
        email: "forbidden@acme.com",
        password: "Password@12345",
        password_confirmation: "Password@12345",
        role: "hr_manager"
      }, headers: @hr_headers
    end

    assert_response :forbidden
    json = JSON.parse(response.body)
    assert_equal "Access denied. Admin privileges required.", json["error"]
  end

  test "should allow admin to update user" do
    patch api_v1_user_url(@hr_user), params: {
      role: "admin"
    }, headers: @admin_headers

    assert_response :ok
    assert_equal "admin", @hr_user.reload.role
  end

  test "should deny non-admin user from updating users" do
    patch api_v1_user_url(@hr_user), params: {
      role: "admin"
    }, headers: @hr_headers

    assert_response :forbidden
    json = JSON.parse(response.body)
    assert_equal "Access denied. Admin privileges required.", json["error"]
  end

  test "should allow admin to delete another user" do
    user_to_delete = User.create!(
      email: "temp.delete@acme.com",
      password: "Password@12345",
      password_confirmation: "Password@12345",
      role: "hr_manager",
      organization: @admin.organization,
      verified: true
    )

    assert_difference("User.count", -1) do
      delete api_v1_user_url(user_to_delete), headers: @admin_headers
    end

    assert_response :no_content
  end

  test "should deny non-admin user from deleting users" do
    delete api_v1_user_url(@admin), headers: @hr_headers
    assert_response :forbidden

    json = JSON.parse(response.body)
    assert_equal "Access denied. Admin privileges required.", json["error"]
  end

  test "should return unauthorized when not authenticated" do
    get api_v1_me_url
    assert_response :unauthorized
  end
end
