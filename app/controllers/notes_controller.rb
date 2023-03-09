class NotesController < ApplicationController
  def index
    @notes = Note.all
    render json: @notes
  end

  def show
    @note = Note.find(params[:id])
    render json: @note
  end

  def create
    @note = Note.new(note_params)
    if @note.save
      render json: @note, status: :created
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  def update
    @note = Note.find(params[:id])
    if @note.update(note_params)
      render json: @note, status: :ok
    else
      render json: @note.errors, status: :unprocessable_entity
    end    
  end

  def destroy 
    @note = Note.find(params[:id])
    if @note.destroy 
      head :no_content 
    else 
      render json: {error: "Could not delete note"}, status: :internal_server_error 
    end 
  end 

  private 

  def note_params 
    params.require(:note).permit(:title, :creation_date, :content, :attachments)
  end 
end