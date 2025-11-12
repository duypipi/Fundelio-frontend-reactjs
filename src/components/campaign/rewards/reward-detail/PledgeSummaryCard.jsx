import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, Plus, Info } from 'lucide-react';

export function PledgeSummaryCard({ selectedReward, onRemoveItem, onPickAddOns, onSubmit }) {
    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const calculateTotal = () => {
        if (!selectedReward) return 0;

        const rewardTotal = selectedReward.reward.min_pledge_amount * (selectedReward.quantity || 1);
        const addOnsTotal = (selectedReward.addOns || []).reduce(
            (sum, addon) => sum + addon.price * addon.quantity,
            0
        );
        return rewardTotal + addOnsTotal;
    };

    if (!selectedReward) {
        return null;
    }

    const hasAddOns = selectedReward.addOns && selectedReward.addOns.length > 0;

    return (
        <Card className="sticky top-8 p-4 bg-white dark:bg-darker-2 border border-border/50">
            <h3 className="text-xs font-semibold text-muted-foreground mb-3">SẢN PHẨM CỦA BẠN</h3>

            {/* Selected Reward */}
            <div className="mb-3 p-3 border border-border rounded-sm bg-background dark:bg-darker relative">
                <button
                    onClick={() => onRemoveItem('reward')}
                    className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                >
                    <X className="w-4 h-4" />
                </button>
                <p className="font-bold text-foreground pr-6 text-sm">
                    {selectedReward.quantity}x {selectedReward.reward.title}
                </p>
            </div>

            {/* Add-ons */}
            {hasAddOns ? (
                <div className="space-y-2 mb-3">
                    {selectedReward.addOns.map((addon) => (
                        <div
                            key={addon.id}
                            className="p-3 border border-border rounded-sm bg-background dark:bg-darker relative"
                        >
                            <button
                                onClick={() => onRemoveItem('addon', addon.id)}
                                className="absolute top-2 right-2 text-destructive hover:text-destructive/80"
                            >
                                <X className="w-4 h-4" />
                            </button>
                            <p className="font-bold text-foreground pr-6 text-sm">
                                {addon.quantity}x {addon.title}
                            </p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="mb-3">
                    <p className="text-xs text-muted-foreground mb-2 text-center py-3">
                        Chưa chọn tiện ích bổ sung
                    </p>
                </div>
            )}

            {/* Pick Add-ons Button */}
            <Button
                variant="outline"
                className="w-full mb-4 font-semibold text-sm h-9"
                onClick={onPickAddOns}
            >
                <Plus className="w-3 h-3 mr-1" />
                CHỌN TIỆN ÍCH BỔ SUNG
            </Button>

            {/* Total */}
            <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-muted-foreground">TỔNG ỦNG HỘ</span>
                    <div className="flex items-center gap-1">
                        <Info className="w-3 h-3 text-muted-foreground" />
                    </div>
                </div>
                <p className="text-2xl font-bold text-foreground">
                    {formatPrice(calculateTotal())} <span className="text-xs">VND</span>
                </p>
            </div>

            {/* Submit Button */}
            <Button
                className="w-full font-bold text-white bg-primary hover:bg-primary/90 h-10 text-sm mb-2"
                onClick={onSubmit}
            >
                XÁC NHẬN ỦNG HỘ
            </Button>

            {/* Manage pledge link */}
            <button
                className="w-full text-primary font-semibold hover:underline text-xs"
                onClick={() => {
                    // Handle manage pledge
                }}
            >
                quản lý khoản ủng hộ
            </button>
        </Card>
    );
}
