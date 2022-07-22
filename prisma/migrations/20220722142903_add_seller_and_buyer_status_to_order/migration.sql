-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "buyerStatus" "OrderStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "sellerStatus" "OrderStatus" NOT NULL DEFAULT 'PENDING';
