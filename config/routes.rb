Rails.application.routes.draw do
  draw :madmin
  devise_for :admins, only: %i[sessions]
  devise_for :users,
    controllers: { sessions: "sessions", passwords: "passwords", omniauth_callbacks: "users/omniauth_callbacks" },
    skip: %i[registrations confirmations unlocks]

  # Redirect to localhost from 127.0.0.1 to use same IP address with Vite server
  constraints(host: "127.0.0.1") do
    get "(*path)", to: redirect { |params, req| "#{req.protocol}localhost:#{req.port}/#{params[:path]}" }
  end

  get "settings", to: "settings#show"

  namespace :settings do
    resources :users, only: %i[update destroy]
  end

  resources :invitations, only: %i[create show update destroy], param: :token do
    member do
      post :google
      post :resend
    end
  end

  resources :notifications, only: [] do
    collection do
      patch :mark_all_read
    end
  end

  namespace :account do
    resource :password, only: :update
  end

  root "dashboard#index"
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Render dynamic PWA files from app/views/pwa/* (remember to link manifest in application.html.erb)
  # get "manifest" => "rails/pwa#manifest", as: :pwa_manifest
  # get "service-worker" => "rails/pwa#service_worker", as: :pwa_service_worker

  # Defines the root path route ("/")
  # root "posts#index"
end
