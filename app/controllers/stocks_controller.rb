class StocksController < ApplicationController
  before_action :set_stock, only: [:show, :edit, :update, :destroy]
  before_action :set_combo_values, only: [:new, :edit, :update, :create]
  load_and_authorize_resource
  # GET /stocks
  # GET /stocks.json
  def index
    @stocks = Stock.all
  end

  # GET /stocks/1
  # GET /stocks/1.json
  def show
  end

  # GET /stocks/new
  def new
    @stock = Stock.new
    item_id = params[:item_id]
    @stock.item_id = item_id
     @stock.total = params[:total]
    @stock.purchase_order_line_id = params[:my_pol]

  end

  # GET /stocks/1/edit
  def edit
  end

  # POST /stocks
  # POST /stocks.json
  def create
    @stock = Stock.new(stock_params)
    @stock.total = 0;
    # inicializar qty_out en cero desde la base datos no olvidar por favor
    @stock.qty_out = 0
    @stock.state = 'disponible'
   
      if @stock.save
        purchase_order_line = PurchaseOrderLine.find(@stock.purchase_order_line_id)
        
         if purchase_order_line.get_available_line_item == 0
           purchase_order_line.asignado!           
          
         end
        @item =  @stock.item
         messagess = 'successesfull' 
      else
         errores = "errors"
      end
  
  end

  # PATCH/PUT /stocks/1
  # PATCH/PUT /stocks/1.json
  def update
    respond_to do |format|
      if @stock.update(stock_params)
        format.html { redirect_to @stock, notice: 'Stock was successfully updated.' }
        format.json { render :show, status: :ok, location: @stock }
      else
        format.html { render :edit }
        format.json { render json: @stock.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /stocks/1
  # DELETE /stocks/1.json
  def destroy
    @stock.destroy
    respond_to do |format|
      format.html { redirect_to stocks_url, notice: 'Stock was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def validate
      stocks = ''
      qty_sale = 0

    if params[:item_id].present?
       item_id = params[:item_id]
       if params[:qty_item_sale].present?
        qty_sale = params[:qty_item_sale] 
         stocks = Item.find(item_id).stocks.where(state: 'disponible')
          if stocks.count > 0
            if Item.find(item_id).get_total_stock >= qty_sale.to_i 
               result = [valid: true]
            else
               result = [valid: false, notice: 'Cantidad de productos es menor que lo que solicita']
            end                                    

          else 
            result = [valid: false, notice: 'Producto agotado' ] 
          end
        end
    end
    # total = stocks.first.total       
    render json: result
    
  end



  private
  def set_combo_values
    @warehouses = Warehouse.all.order(:name)
  end
    # Use callbacks to share common setup or constraints between actions.
    def set_stock
      @stock = Stock.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def stock_params
      params.require(:stock).permit(:qty_in, :qty_out, :total, :item_id, :warehouse_id, :purchase_order_line_id)
    end
end

