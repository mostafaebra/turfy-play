const BookingSummary = ({ fieldData, selectedSlot, duration, fieldId }) => {
    const hourlyPrice = fieldData.hourlyPrice;
    
    // Duration Logic: Map Enum back to multiplier (e.g., HourAndHalf = 1.5)
    const durationMap = { 1: 1, 2: 1.5, 3: 2, 4: 2.5, 5: 3 };
    const hoursMultiplier = durationMap[duration] || 1;
    
    const basePrice = (selectedSlot?.price || hourlyPrice) * hoursMultiplier;
    const serviceFee = basePrice * (fieldData.serviceFeePercentage / 100);
    const total = basePrice + serviceFee;

    const handleCheckout = async () => {
        if (!selectedSlot) return alert("Please select a time slot first!");

        const payload = {
            fieldId: fieldId,
            bookingDate: selectedSlot.date,
            bookingTime: selectedSlot.time,
            bookingDuration: duration,
            totalPrice: total,
            paymentMethod: 1, // Defaulting to 1 based on requirement
            playerId: "49524f19-cb57-4471-5452-08de5efa8baa" // Static as per prompt
        };

        try {
            const result = await bookingApi.bookField(payload);
            if (result.isSuccess) alert("Booking Successful!");
            else alert(result.message || "Booking Failed");
        } catch (err) {
            alert("Network error during booking.");
        }
    };

    return (
        <div className="border border-border-light dark:border-border-dark rounded-xl p-6 flex flex-col gap-4 bg-white dark:bg-background-dark/50 shadow-sm">
            <h2 className="text-lg font-bold">Your Booking Summary</h2>
            <div className="flex flex-col gap-3 text-sm pt-4">
                <div className="flex justify-between">
                    <p className="text-text-light/80">Selected Time</p>
                    <p className="font-semibold text-right">
                        {selectedSlot ? `${selectedSlot.time} (${hoursMultiplier}h)` : 'Select a slot'}
                    </p>
                </div>
                <div className="flex justify-between">
                    <p className="text-text-light/80">Price</p>
                    <p className="font-semibold">RM {basePrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between">
                    <p className="text-text-light/80">Service Fee ({fieldData.serviceFeePercentage}%)</p>
                    <p className="font-semibold">RM {serviceFee.toFixed(2)}</p>
                </div>
            </div>
            <div className="w-full h-px bg-border-light my-2"></div>
            <div className="flex justify-between items-center">
                <p className="text-base font-bold">Total Due</p>
                <p className="text-2xl font-black text-primary">RM {total.toFixed(2)}</p>
            </div>
            <button 
                onClick={handleCheckout}
                className="w-full h-12 mt-4 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 transition-colors"
            >
                Proceed to Checkout
            </button>
        </div>
    );
};
export default BookingSummary;