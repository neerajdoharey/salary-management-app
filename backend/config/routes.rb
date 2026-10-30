Rails.application.routes.draw do
  mount Rswag::Ui::Engine => '/api-docs'
  mount Rswag::Api::Engine => '/api-docs'
  mount MissionControl::Jobs::Engine => '/jobs'

  namespace :api do
    namespace :v1 do
      post "sign_in", to: "sessions#create"
      delete "sign_out", to: "sessions#destroy"
      post "sign_up", to: "registrations#create"
      get "me", to: "users#me"

      resources :organizations, only: [] do
        collection do
          get :validate
        end
      end

      resources :users, only: [:index, :show, :create, :update, :destroy]

      resources :employees do
        collection do
          post :import
        end
      end

      get "analytics", to: "analytics#index"
    end
  end

  get "up" => "rails/health#show", as: :rails_health_check
end
