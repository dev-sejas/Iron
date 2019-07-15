require 'test_helper'

class MovementsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @movement = movements(:one)
  end

  test "should get index" do
    get movements_url
    assert_response :success
  end

  test "should get new" do
    get new_movement_url
    assert_response :success
  end

  test "should create movement" do
    assert_difference('Movement.count') do
      post movements_url, params: { movement: { qty_in: @movement.qty_in, qty_out: @movement.qty_out, sale_detail_id: @movement.sale_detail_id, stock_id: @movement.stock_id } }
    end

    assert_redirected_to movement_url(Movement.last)
  end

  test "should show movement" do
    get movement_url(@movement)
    assert_response :success
  end

  test "should get edit" do
    get edit_movement_url(@movement)
    assert_response :success
  end

  test "should update movement" do
    patch movement_url(@movement), params: { movement: { qty_in: @movement.qty_in, qty_out: @movement.qty_out, sale_detail_id: @movement.sale_detail_id, stock_id: @movement.stock_id } }
    assert_redirected_to movement_url(@movement)
  end

  test "should destroy movement" do
    assert_difference('Movement.count', -1) do
      delete movement_url(@movement)
    end

    assert_redirected_to movements_url
  end
end