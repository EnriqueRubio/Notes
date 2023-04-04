class Api::NotesController < ApplicationController
  before_action :set_note, only: %i[ show update destroy share unshare update_shared ]
  before_action :authenticate_api_user!

  # GET /notes
  def index
    @notes = Note.where(author_id: current_api_user.id)
    render json: @notes
  end

  # GET /notes/1
  def show
    render json: @note
  end

  # POST /notes
  def create
    @note = Note.new(note_params)
    @note.author_id = current_api_user.id

    if @note.save
      render json: @note, status: :created
    else
      render json: @note.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /notes/1
  def update
    @note.author_id = current_api_user.id

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

  # GET /users/search
  def search
    query = params[:q]
    if query.present?
      notes = Note.or(
        { author: current_api_user, title:  /#{query}/i },
        { author: current_api_user, content:  /#{query}/i }
      )

      if notes.any?
        render json: { notes: notes }, status: :ok
      else
        render json: { message: "No notes found." }, status: :ok
      end
    else
      render json: { message: "Search query is empty." }, status: :bad_request
    end
  end

  # Get /notes/by_collections/:collection_id
  def by_collections
    collection_ids = params[:collection_ids].split(',').map(&:strip)
    puts("Collection ids: #{collection_ids.inspect}")
    @notes = Note.in(parent_collection_id: collection_ids)
    puts("Notes: #{@notes}")
    render json: @notes
  end

  # Get /notes/shared_with_me
  def shared_with_me
    @notes = Note.where(shared_to: current_api_user.id)
    render json: @notes
  end

  # Get /notes/shared_to/:user_id
  def shared_to
    @notes = Note.where(author: current_api_user.id, shared_to: params[:user_id])
    render json: @notes
  end

# Put /notes/:id/update_shared
def update_shared
  puts("LA NOTA: #{@note}")
  puts("PARAMS: #{params[:shared_to]}")
  # Convierte los elementos de la lista en objetos apropiados
  shared_to_ids = params[:shared_to].map { |friend| friend["$oid"] }

  # Busca los objetos User a partir de los IDs
  shared_to_users = User.find(shared_to_ids)

  # Asigna los objetos User a la lista shared_to de la nota
  @note.shared_to = shared_to_users
  if @note.save
    render json: { message: 'Note successfully updated' }, status: :ok
  else
    puts "Error saving note: #{@note.errors.full_messages}"
    render json: { errors: @note.errors.full_messages }, status: :unprocessable_entity
  end
end


  # Put /notes/:id/share
  def share
    @note.shared_to << params[:user_id]
    if @note.save
      render json: { message: 'Note successfully shared' }, status: :ok
    else
      puts "Error saving note: #{@note.errors.full_messages}"
      render json: { errors: @note.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Put /notes/:id/unshare
  def unshare
    @note.shared_to.delete(params[:user_id])
    if @note.save
      render json: { message: 'Note successfully unshared' }, status: :ok
    else
      puts "Error saving note: #{@note.errors.full_messages}"
      render json: { errors: @note.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_note
    @note = Note.find(params[:id])
  end

  # Only allow a list of trusted parameters through.
  def note_params
    params.require(:note).permit(:title, :creation_date, :attachments, :avatar, content: {})
  end  
end