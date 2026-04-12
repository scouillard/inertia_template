# Below are the routes for madmin
authenticate :admin do
  namespace :madmin do
    root to: "dashboard#show"
    resources :users
    resources :invitations
  end
end
