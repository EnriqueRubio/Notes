class Api::FriendshipsController < ApplicationController
    before_action :set_friendship, only: %i[ show update destroy ]
    before_action :authenticate_api_user!
    
    # GET /friendships
    def index
        @friendships = Friendship.where(sender: current_api_user.id).or(Friendship.where(receiver: current_api_user.id))

        # Hacer una lista de users que son amigos del usuario actual
        @friends = []
        @friendships.each do |friendship|
            friend = nil
            friend_status = nil
            if friendship.sender == current_api_user
                friend = friendship.receiver
                if(friendship.status == "pending")
                    friend_status = "sent"
                else
                    friend_status = "accepted"
                end
            else
                friend = friendship.sender
                if(friendship.status == "pending")
                    friend_status = "received"
                else
                    friend_status = "accepted"
                end
            end
            friend_data = {
                relationship_id: friendship.id,
                user: friend,
                relationship_creation_date: friendship.created_at,
                relationship_update_date: friendship.updated_at,
                status: friend_status
            }
            @friends << friend_data
        end
        render json: @friends
    end

    # GET /friendships/1
    def show
        render json: @friendship
    end
    
    # POST /friendships
    def create
        #already_exists = Friendship.and({ sender: current_api_user }, { receiver: /#{query}/i })
        puts("friendship_params: #{friendship_params}")
        already_exists = Friendship.or(
            { sender: friendship_params[:sender], receiver: friendship_params[:receiver] },
            { sender: friendship_params[:receiver], receiver: friendship_params[:sender] }
          )
        if already_exists.any?
            render json: { message: "Ya existe una relación entre estos usuarios." }, status: :ok
        else
            @friendship = Friendship.new(friendship_params)
            
            if @friendship.save
            render json: @friendship, status: :created
            else
            render json: @friendship.errors, status: :unprocessable_entity
            end
        end
    end
    
    # PATCH/PUT /friendships/1
    def update
        if @friendship.update_attribute(:status, friendship_params[:status])
            render json: @friendship, status: :ok
        else
            render json: @friendship.errors, status: :unprocessable_entity
        end
    end
    
    # DELETE /friendships/1
    def destroy
        @friendship.destroy
    end
    
    private
        # Use callbacks to share common setup or constraints between actions.
        def set_friendship
        @friendship = Friendship.find(params[:id])
        end
    
        # Only allow a list of trusted parameters through.
        def friendship_params
        params.require(:friendship).permit(:sender, :receiver, :status)
        end
end
