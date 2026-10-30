class Employee < ApplicationRecord
  belongs_to :organization, optional: true


  validates :first_name, :last_name, :job_title, :department, :country, presence: true
  validates :email, presence: true, uniqueness: { case_sensitive: false }, format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :salary, presence: true, numericality: { greater_than_or_equal_to: 0 }

  scope :for_organization, ->(org) { where(organization_id: org.id) if org.present? }


  scope :by_country, ->(country) { where(country: country) if country.present? }
  scope :by_department, ->(department) { where(department: department) if department.present? }
  scope :by_salary_range, ->(min, max) {
    scoped = all
    scoped = scoped.where("salary >= ?", min) if min.present?
    scoped = scoped.where("salary <= ?", max) if max.present?
    scoped
  }
  scope :search_query, ->(query) {
    if query.present?
      q = "%#{query.strip}%"
      where("first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR job_title LIKE ?", q, q, q, q)
    end
  }

  def full_name
    "#{first_name} #{last_name}"
  end
end
