Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Defines the root path route ("/")
  # root "articles#index"

  get "test" => "application#test"

  #get "notes" => "notes#index"

  resources :notes, only: [:index, :show, :create, :update, :destroy]
  #resources :users, only: [:index, :show, :create, :update, :destroy]

  get 'login', to: 'sessions#new'
  post 'login', to: 'sessions#create'
  delete 'logout', to: 'sessions#destroy'
end
