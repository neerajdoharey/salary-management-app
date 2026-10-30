Rswag::Api.configure do |c|
  # Specify a root folder where Swagger JSON/YAML files are located
  c.openapi_root = Rails.root.join('swagger').to_s
end
