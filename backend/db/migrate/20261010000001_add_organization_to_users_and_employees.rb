class AddOrganizationToUsersAndEmployees < ActiveRecord::Migration[8.1]
  def change
    add_reference :users, :organization, foreign_key: true, null: true
    add_reference :employees, :organization, foreign_key: true, null: true
  end
end
