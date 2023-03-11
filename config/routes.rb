Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Defines the root path route ("/")
  namespace :api do
    resources :notes, only: [:index, :show, :create, :update, :destroy]

    resources :users, only: [:index, :show, :create, :update, :destroy]
  end
end
