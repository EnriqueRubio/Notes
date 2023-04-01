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

    get '/users/search', to: 'users#search'

    get 'users/:id', to: 'users#show', as: 'user'

    get 'users/:id/avatar', to: 'avatars#show', as: 'user_avatar'

    patch 'users/:id/avatar', to: 'avatars#update', as: 'update_user_avatar'

    put 'users/:id', to: 'users#update', as: 'update_user'

    get '/notes/search', to: 'notes#search'

    get '/member-data', to: 'member#show'

    resources :notes, only: [:index, :show, :create, :update, :destroy]
    get '/notes/by_collections/:collection_ids', to: 'notes#by_collections'

    resources :collections, only: [:index, :show, :create, :update, :destroy] do 
      member do
        post "add_note"
        post "remove_note"
      end
    end

    resources :friends, controller: 'friendships', only: [:index, :show, :create, :update, :destroy]
  end
end
