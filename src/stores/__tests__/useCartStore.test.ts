import { useCartStore } from '../useCartStore';

describe('useCartStore', () => {
  beforeEach(() => {
    useCartStore.setState({
      items: [],
    });
  });

  describe('initial state', () => {
    it('should have empty items array', () => {
      expect(useCartStore.getState().items).toEqual([]);
    });
  });

  describe('addItem', () => {
    it('should add a new item to cart', () => {
      useCartStore.getState().addItem(1, 2);
      expect(useCartStore.getState().items).toHaveLength(1);
      expect(useCartStore.getState().items[0]).toEqual({
        productId: 1,
        quantity: 2,
        selected: true,
      });
    });

    it('should increase quantity when adding existing item', () => {
      useCartStore.getState().addItem(1, 2);
      useCartStore.getState().addItem(1, 3);
      expect(useCartStore.getState().items).toHaveLength(1);
      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });
  });

  describe('removeItem', () => {
    it('should remove item by productId', () => {
      useCartStore.getState().addItem(1, 1);
      useCartStore.getState().addItem(2, 1);
      useCartStore.getState().removeItem(1);
      expect(useCartStore.getState().items).toHaveLength(1);
      expect(useCartStore.getState().items[0].productId).toBe(2);
    });

    it('should not throw when removing non-existent item', () => {
      expect(() => useCartStore.getState().removeItem(999)).not.toThrow();
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      useCartStore.getState().addItem(1, 1);
      useCartStore.getState().updateQuantity(1, 5);
      expect(useCartStore.getState().items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is 0 or less', () => {
      useCartStore.getState().addItem(1, 1);
      useCartStore.getState().updateQuantity(1, 0);
      expect(useCartStore.getState().items).toHaveLength(0);
    });
  });

  describe('toggleSelect', () => {
    it('should toggle item selection', () => {
      useCartStore.getState().addItem(1, 1);
      expect(useCartStore.getState().items[0].selected).toBe(true);
      useCartStore.getState().toggleSelect(1);
      expect(useCartStore.getState().items[0].selected).toBe(false);
      useCartStore.getState().toggleSelect(1);
      expect(useCartStore.getState().items[0].selected).toBe(true);
    });
  });

  describe('toggleSelectAll', () => {
    it('should select all when some are unselected', () => {
      useCartStore.getState().addItem(1, 1);
      useCartStore.getState().addItem(2, 1);
      useCartStore.getState().toggleSelect(1);
      expect(useCartStore.getState().items[0].selected).toBe(false);

      useCartStore.getState().toggleSelectAll();
      expect(useCartStore.getState().items.every(i => i.selected)).toBe(true);
    });

    it('should unselect all when all are selected', () => {
      useCartStore.getState().addItem(1, 1);
      useCartStore.getState().addItem(2, 1);
      useCartStore.getState().toggleSelectAll();
      expect(useCartStore.getState().items.every(i => !i.selected)).toBe(true);
    });
  });

  describe('clearCart', () => {
    it('should remove all items', () => {
      useCartStore.getState().addItem(1, 1);
      useCartStore.getState().addItem(2, 1);
      useCartStore.getState().clearCart();
      expect(useCartStore.getState().items).toEqual([]);
    });
  });

  describe('getTotalCount', () => {
    it('should return total quantity of all items', () => {
      useCartStore.getState().addItem(1, 2);
      useCartStore.getState().addItem(2, 3);
      expect(useCartStore.getState().getTotalCount()).toBe(5);
    });

    it('should return 0 for empty cart', () => {
      expect(useCartStore.getState().getTotalCount()).toBe(0);
    });
  });

  describe('getSelectedCount', () => {
    it('should return total quantity of selected items', () => {
      useCartStore.getState().addItem(1, 2);
      useCartStore.getState().addItem(2, 3);
      useCartStore.getState().toggleSelect(2);
      expect(useCartStore.getState().getSelectedCount()).toBe(2);
    });
  });

  describe('getSelectedIds', () => {
    it('should return array of selected productIds', () => {
      useCartStore.getState().addItem(1, 1);
      useCartStore.getState().addItem(2, 1);
      useCartStore.getState().toggleSelect(2);
      expect(useCartStore.getState().getSelectedIds()).toEqual([1]);
    });
  });

  describe('isAllSelected', () => {
    it('should return true when all items are selected and cart is not empty', () => {
      useCartStore.getState().addItem(1, 1);
      useCartStore.getState().addItem(2, 1);
      expect(useCartStore.getState().isAllSelected()).toBe(true);
    });

    it('should return false when some items are unselected', () => {
      useCartStore.getState().addItem(1, 1);
      useCartStore.getState().addItem(2, 1);
      useCartStore.getState().toggleSelect(2);
      expect(useCartStore.getState().isAllSelected()).toBe(false);
    });

    it('should return false when cart is empty', () => {
      expect(useCartStore.getState().isAllSelected()).toBe(false);
    });
  });
});
