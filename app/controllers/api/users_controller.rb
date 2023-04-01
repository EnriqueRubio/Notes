class Api::UsersController < ApplicationController
  before_action :set_user, only: %i[ show update destroy ]
  before_action :authenticate_api_user!

  # GET /users
  def index
    @users = User.all

    render json: @users
  end

  # GET /users/1
  def show
    render json: @user, status: :ok
  end

  # POST /users
  def create
    @user = User.new(user_params)
    
    if @user.save
      render json: @user, status: :created, location: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /users/1
  def update
    puts("PARAMS: #{user_params}")
    if @user.update(user_params)
      render json: @user
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
  end

# GET /users/search
def search
  query = params[:q]

  if query.present?
    users = User.or({ username: /#{query}/i }, { email: /#{query}/i })
    friends = Friendship.where(sender: current_api_user.id).or(Friendship.where(receiver: current_api_user.id))
    friends_ids = friends.pluck(:sender_id, :receiver_id).flatten.uniq
    users = users.not_in(id: friends_ids + [current_api_user.id])
    puts("users: #{users}")

    if users.any?
      render json: users, status: :ok
    else
      render json: { message: "No users found." }, status: :ok
    end
  else
    render json: { message: "Search query is empty." }, status: :bad_request
  end
end




  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def user_params
      params.require(:user).permit(:username, :email, :password, :admin)
    end
end
