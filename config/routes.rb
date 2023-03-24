Rails.application.routes.draw do
  namespace :api do
    devise_for :users,
      path: 'user',
      path_names: {
        sign_in: 'signin',
        sign_out: 'logout',
        registration: 'signup'
      },
      controllers: {
        sessions: 'users/sessions',
        registrations: 'users/registrations'
      }

    get '/member-data', to: 'member#show'

    resources :notes, only: [:index, :show, :create, :update, :destroy]

  end
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html
  # Defines the root path route ("/")
  #namespace :api do
    #resources :notes, only: [:index, :show, :create, :update, :destroy]

    #resources :users, only: [:index, :show, :create, :update, :destroy]
  #end
end
