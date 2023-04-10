class Api::AvatarsController < ApplicationController
    before_action :authenticate_api_user!
    def show
        user = User.find(params[:id])
        if user.avatar.present?
          render json: { avatar_url: user.avatar.url }, status: :ok
        else
          render json: { error: "Avatar not found" }, status: :not_found
        end
    end

    def update
        user = User.find(params[:id])

        puts("PARAMS: #{params[:avatar]}")
    
        if user.update(avatar: params[:avatar])
        # Separar url de avatar por caracter "/" y tomar los últimos 5 elementos
        puts("URL: #{user.avatar.url}")
        url = user.avatar.url.split("/").last(5).join("/")
        puts("URL: #{url}")
        render json: { avatar_url: "/#{url}" }, status: :ok
          #render json: { avatar_url: user.avatar.url }, status: :ok
        else
          render json: { error: "Error updating avatar" }, status: :unprocessable_entity
        end
      end
end