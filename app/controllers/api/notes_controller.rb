class Api::NotesController < ApplicationController
  before_action :set_note, only: %i[ show update destroy ]
  #before_action :authenticate_api_user!

  # GET /notes
  def index
    @notes = Note.all

    render json: @notes
  end

  # GET /notes/1
  def show
    render json: @note
  end

  # POST /notes
  def create
    @note = Note.new(note_params)
    #@note.author_id = current_api_user
    @note.author_id = User.find_by!(_id: "64136824b064af32941a7b13")
    if @note.save
      render json: @note, status: :created
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /notes/1
  def update
    #@note.author_id = current_api_user
    @note.author_id = User.find_by!(_id: "64136824b064af32941a7b13")
    if @note.update(note_params)
      render json: @note
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  # DELETE /notes/1
  def destroy
    @note.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_note
      @note = Note.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def note_params
      params.require(:note).permit(:title, :creation_date, :content, :attachments)
    end
end