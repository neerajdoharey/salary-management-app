require "test_helper"

class OrganizationTest < ActiveSupport::TestCase
  setup do
    @org = organizations(:acme)
  end

  test "valid organization" do
    assert @org.valid?
  end

  test "generates slug before validation" do
    org = Organization.create!(name: "Stark Industries")
    assert_equal "stark-industries", org.slug
  end

  test "invalid without name" do
    org = Organization.new
    assert_not org.valid?
    assert_includes org.errors[:name], "can't be blank"
  end

  test "has many employees and users" do
    assert_includes @org.users, users(:one)
    assert_includes @org.employees, employees(:one)
  end
end
