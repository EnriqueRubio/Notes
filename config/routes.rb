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
    get '/users/:id/number_of_notes', to: 'users#number_of_notes'
    get '/users/:id/number_of_collections', to: 'users#number_of_collections'

    get '/member-data', to: 'member#show'

    resources :notes, only: [:index, :show, :create, :update, :destroy]
    get '/notes/by_collections/:collection_ids', to: 'notes#by_collections'
    get '/notes/search', to: 'notes#search'
    get '/notes/shared_with_me', to: 'notes#shared_with_me'
    get '/notes/shared_to/:user_id', to: 'notes#shared_to'
    put '/notes/:id/update_shared', to: 'notes#update_shared'
    put '/notes/:id/share', to: 'notes#share', as: 'share_note'
    put '/notes/:id/unshare', to: 'notes#unshare', as: 'unshare_note'

    resources :collections, only: [:index, :show, :create, :update, :destroy] do 
      member do
        post "add_note"
        post "remove_note"
      end
    end
    get '/collections/shared_with_me', to: 'collections#shared_with_me'
    get '/collections/shared_to/:user_id', to: 'collections#shared_to'
    put '/collections/:id/share', to: 'collections#share', as: 'share_collection'
    put '/collections/:id/unshare', to: 'collections#unshare', as: 'unshare_collection'

    get '/friends/only_accepted', to: 'friendships#only_accepted'
    resources :friends, controller: 'friendships', only: [:index, :show, :create, :update, :destroy]
  end
end
