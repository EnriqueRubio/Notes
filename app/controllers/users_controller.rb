class UsersController < ApplicationController 
  def index 
    @users = User.all 
    render json: @users 
  end 

  def show 
    @user = User.find(params[:id]) 
    render json: @user 
  end 

  def create 
    @user = User.new(user_params) 
    if @user.save 
      render json: @user, status: :created  
     else  
       render json: @user.errors, status: :unprocessable_entity
     end  
   end  

   def update  
     @user=User.find(params[:id])  
     if @user.update(user_params)  
      render json: @user, status: :ok
     else  
      render json: @user.errors, status: :unprocessable_entity
     end   
   end  

   def destroy   
     @user=User.find(params[:id])   
     if @user.destroy    
       head :no_content
     else    
       render json:{error:"Could not delete user"}, status: :internal_server_error   
     end   
   end   

   private   

   def user_params    
     params.require(:user).permit(:username, :email, :password, :admin)   
   end   
end