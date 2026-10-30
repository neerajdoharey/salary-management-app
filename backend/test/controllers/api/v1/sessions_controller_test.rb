require "test_helper"

class Api::V1::SessionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user = users(:one)
  end

  test "should sign in with valid credentials" do
    post api_v1_sign_in_url, params: { email: @user.email, password: "Password@12345" }
    assert_response :created

    json = JSON.parse(response.body)
    assert json["token"].present?
    assert_equal @user.email, json["user"]["email"]
    assert response.headers["X-Session-Token"].present?
  end

  test "should not sign in with invalid password" do
    post api_v1_sign_in_url, params: { email: @user.email, password: "WrongPassword" }
    assert_response :unauthorized

    json = JSON.parse(response.body)
    assert_equal "Invalid email or password", json["error"]
  end

  test "should sign out active session" do
    headers = auth_headers_for(@user)

    delete api_v1_sign_out_url, headers: headers
    assert_response :ok

    json = JSON.parse(response.body)
    assert_equal "Signed out successfully", json["message"]
  end

  test "should return unauthorized when signing out without token" do
    delete api_v1_sign_out_url
    assert_response :unauthorized
  end
end
