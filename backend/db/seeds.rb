puts "Starting database seed..."

# 1. Create Default Organization
acme_org = Organization.find_or_create_by!(name: "ACME Corp")
puts "Created Organization: #{acme_org.name} (#{acme_org.slug})"

# 2. Create Default Admin & HR Manager Users
admin_user = User.find_or_initialize_by(email: "hr@acme.com")
admin_user.password = "Password@12345"
admin_user.password_confirmation = "Password@12345"
admin_user.role = "admin"
admin_user.verified = true
admin_user.organization = acme_org
admin_user.save!
puts "Created Org Admin user: hr@acme.com / Password@12345 (Role: #{admin_user.role}, Organization: #{acme_org.name})"

hr_user = User.find_or_initialize_by(email: "hrmanager@acme.com")
hr_user.password = "Password@12345"
hr_user.password_confirmation = "Password@12345"
hr_user.role = "hr_manager"
hr_user.verified = true
hr_user.organization = acme_org
hr_user.save!
puts "Created HR Manager user: hrmanager@acme.com / Password@12345 (Role: #{hr_user.role}, Organization: #{acme_org.name})"

# 3. Bulk Seed 10,000 Employees for ACME Corp
puts "Clearing existing employees..."
Employee.delete_all

departments = ["Engineering", "Sales", "Marketing", "Human Resources", "Finance", "Product", "Legal", "Operations"]
countries = ["United States", "United Kingdom", "Germany", "India", "Canada", "Japan", "Australia", "France", "Brazil", "Singapore"]
titles = {
  "Engineering" => ["Software Engineer", "Senior Software Engineer", "DevOps Engineer", "Engineering Manager", "QA Specialist"],
  "Sales" => ["Account Executive", "Sales Manager", "Business Development Rep", "Sales Director"],
  "Marketing" => ["Content Marketer", "SEO Specialist", "Marketing Director", "Growth Manager"],
  "Human Resources" => ["HR Specialist", "Talent Acquisition Lead", "HR Manager", "People Ops Lead"],
  "Finance" => ["Financial Analyst", "Accountant", "Finance Manager", "VP of Finance"],
  "Product" => ["Product Manager", "Senior Product Manager", "UI/UX Designer", "Design Lead"],
  "Legal" => ["Legal Counsel", "Compliance Specialist", "Corporate Lawyer"],
  "Operations" => ["Operations Manager", "Supply Chain Analyst", "Logistics Coordinator"]
}

total_employees = 10_000
batch_size = 2_000
employees_batch = []
now = Time.current

puts "Generating #{total_employees} employee records for #{acme_org.name} in batches..."

total_employees.times do |i|
  dept = departments.sample
  country = countries.sample
  title = titles[dept].sample
  first_name = Faker::Name.first_name
  last_name = Faker::Name.last_name
  email = "#{first_name.downcase}.#{last_name.downcase}.#{i + 1}@acme.com"

  base_salary = case title
                when /Director|VP|Manager|Lead|Counsel/ then rand(110_000..220_000)
                when /Senior/ then rand(85_000..150_000)
                else rand(45_000..95_000)
                end

  employees_batch << {
    organization_id: acme_org.id,
    first_name: first_name,
    last_name: last_name,
    email: email,
    job_title: title,
    department: dept,
    country: country,
    salary: base_salary.round(2),
    created_at: now,
    updated_at: now
  }

  if employees_batch.size >= batch_size
    Employee.insert_all(employees_batch)
    puts "Inserted #{i + 1} / #{total_employees} records..."
    employees_batch.clear
  end
end

if employees_batch.any?
  Employee.insert_all(employees_batch)
end

puts "Database seeded successfully! Total Employees: #{Employee.count}"