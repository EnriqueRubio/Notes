class Api::CollectionsController < ApplicationController
  before_action :set_collection, only: %i[ show update destroy add_note remove_note update_shared ]
  before_action :authenticate_api_user!

  # GET /collections
def index
    @user = User.find_by(id: current_api_user.id)
    if(@user.admin)
      @collections = Collection.all
    else
      authored_collections = Collection.where(author_id: current_api_user.id)
      shared_collections = Collection.where(:shared_to_ids.in => [current_api_user.id])
      @collections = authored_collections + shared_collections
    end
    render json: @collections
  end

  # GET /collections/1
  def show
    render json: @collection
  end

  # POST /collections
  def create
    @collection = Collection.new(collection_params)
    @collection.author = current_api_user.id

    if @collection.save
      render json: @collection, status: :created
    else
      render json: @collection.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /collections/1
  def update
    if !current_api_user.admin
      @collection.author = current_api_user.id
    end

    if @collection.update(collection_params)
      render json: @collection
    else
      render json: @collection.errors, status: :unprocessable_entity
    end
  end

  # PUT /collections/:collection_id/add_note
  def add_note
    @note = Note.find(params[:note_id])
    puts("Nota: #{@note._id}")
    puts("Colección: #{@collection._id}")
    @note.parent_collections << @collection
    @note.save
  
    # Aquí va la lógica para añadir la nota a la colección
    @collection.notes << @note
  
    if @collection.save
      render json: { message: 'Note successfully added to collection' }, status: :ok
    else
      puts "Error saving collection: #{@collection.errors.full_messages}"
      render json: { errors: @collection.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PUT /collections/:collection_id/remove_note
  def remove_note
    @note = Note.find(params[:note_id])
    @note.parent_collections.delete(@collection)
    @note.save

    # Aquí va la lógica para eliminar la nota de la colección
    @collection.notes.delete(@note)

    if @collection.save
      render json: { message: 'Note successfully removed from collection' }, status: :ok
    else
      puts "Error saving collection: #{@collection.errors.full_messages}"
      render json: { errors: @collection.errors.full_messages }, status: :unprocessable_entity
    end
  end


  # DELETE /collections/1
  def destroy
    notes = Note.where(parent_collection_id: @collection._id)
    notes.each do |note|
      note.parent_collection_id = nil
      note.save
    end

    @collection.destroy
  end

  # Get /collections/shared_with_me
  def shared_with_me
    @collections = Collection.where(shared_to: current_api_user.id)
    render json: @collections
  end

  # Get /collections/shared_to/:user_id
  def shared_to
    @collections = Collection.where(author: current_api_user.id, shared_to: params[:user_id])
    render json: @collections
  end

# Put /collections/:id/update_shared
def update_shared
  puts("LA COLECCIÓN: #{@collection}")
  puts("PARAMS: #{params[:shared_to]}")
  # Convierte los elementos de la lista en objetos apropiados
  shared_to_ids = params[:shared_to].map { |friend| friend["$oid"] }

  # Busca los objetos User a partir de los IDs
  shared_to_users = User.find(shared_to_ids)

  # Asigna los objetos User a la lista shared_to de la nota
  @collection.shared_to = shared_to_users
  if @collection.save
    render json: { message: 'Collection successfully updated' }, status: :ok
  else
    puts "Error saving collection: #{@collection.errors.full_messages}"
    render json: { errors: @collection.errors.full_messages }, status: :unprocessable_entity
  end
end

  # Put /collections/:id/share
  def share
    @collection.shared_to << params[:user_id]
    if @collection.save
      render json: { message: 'Collection successfully shared' }, status: :ok
    else
      puts "Error saving collection: #{@collection.errors.full_messages}"
      render json: { errors: @collection.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # Put /collections/:id/unshare
  def unshare
    @collection.shared_to.delete(params[:user_id])
    if @collection.save
      render json: { message: 'Collection successfully unshared' }, status: :ok
    else
      puts "Error saving collection: #{@collection.errors.full_messages}"
      render json: { errors: @collection.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_collection
    puts("Setting collection: #{params[:id]}")
    @collection = Collection.find(params[:id])
  end

  def collection_params
    params.require(:collection).permit(:title, :description, :textColor, :bgColor, :borderColor, :author, :shared_to, :notes)
  end
end
