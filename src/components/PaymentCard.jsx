import React, { useState } from 'react';

function PaymentCard({ 
	index = 1, 
	onSave, 
	onDelete, 
	initialData = null,
	isDefault = false,
	onSetDefault
}) {
	// State for form data
	const [cardData, setCardData] = useState(initialData || {
		cardNumber: '',
		expirationDate: '',
		securityCode: '',
		nameOnCard: ''
	});

	// State for form errors
	const [errors, setErrors] = useState({});
	const [isSaving, setIsSaving] = useState(false);
	const [isEditing, setIsEditing] = useState(!initialData);

	// Handle input changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setCardData(prev => ({
			...prev,
			[name]: value
		}));

		// Clear error for this field
		if (errors[name]) {
			setErrors(prev => ({
				...prev,
				[name]: ''
			}));
		}
	};

	// Validate the form
	const validateForm = () => {
		const newErrors = {};
		
		// Required fields
		const requiredFields = {
			cardNumber: 'Card Number',
			expirationDate: 'Expiration Date',
			securityCode: 'Security Code',
			nameOnCard: 'Name on Card'
		};

		// Check required fields
		Object.keys(requiredFields).forEach(field => {
			if (!cardData[field]?.trim()) {
				newErrors[field] = `${requiredFields[field]} is required`;
			}
		});

		// Special validations
		if (cardData.cardNumber && !/^\d{16}$/.test(cardData.cardNumber.replace(/\D/g, ''))) {
			newErrors.cardNumber = 'Please enter a valid 16-digit card number';
		}

		if (cardData.expirationDate && !/^\d{2}\/\d{2}$/.test(cardData.expirationDate)) {
			newErrors.expirationDate = 'Please enter a valid date (MM/YY)';
		}

		if (cardData.securityCode && !/^\d{3,4}$/.test(cardData.securityCode)) {
			newErrors.securityCode = 'Please enter a valid security code';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	// Handle save
	const handleSave = () => {
		const isValid = validateForm();
		
		if (isValid) {
			setIsSaving(true);
			
			// Simulate API call with setTimeout
			setTimeout(() => {
				if (onSave) onSave(cardData);
				setIsSaving(false);
				setIsEditing(false);
			}, 800);
		}
	};

	// Format card number for display (e.g., **** **** **** 1234)
	const formatCardNumber = (number) => {
		if (!number) return '';
		const lastFour = number.slice(-4);
		return `•••• •••• •••• ${lastFour}`;
	};

	return (
		<div className="bg-white p-4 sm:p-6 rounded-lg shadow mb-4 border w-full">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-base sm:text-lg font-semibold">Card #{index}</h3>
				<div className="flex items-center gap-2">
					{initialData && !isEditing && (
						<button
							onClick={() => setIsEditing(true)}
							className="text-blue-600 hover:text-blue-800"
							aria-label="Edit card"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
							</svg>
						</button>
					)}
					{initialData && (
						<button
							onClick={onDelete}
							className="text-red-600 hover:text-red-800"
							aria-label="Delete card"
						>
							<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
						</button>
					)}
				</div>
			</div>

			{isEditing ? (
				<form className="space-y-3 sm:space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							CARD NUMBER <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="cardNumber"
							value={cardData.cardNumber}
							onChange={handleInputChange}
							className={`w-full p-2 border rounded ${errors.cardNumber ? 'border-red-500' : ''}`}
							placeholder="1234 1234 1234 1234"
						/>
						{errors.cardNumber && (
							<p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>
						)}
					</div>

					<div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
						<div className="w-full sm:w-1/2">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								EXPIRATION DATE <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="expirationDate"
								value={cardData.expirationDate}
								onChange={handleInputChange}
								className={`w-full p-2 border rounded ${errors.expirationDate ? 'border-red-500' : ''}`}
								placeholder="MM/YY"
							/>
							{errors.expirationDate && (
								<p className="text-red-500 text-xs mt-1">{errors.expirationDate}</p>
							)}
						</div>
						<div className="w-full sm:w-1/2">
							<label className="block text-sm font-medium text-gray-700 mb-1">
								SECURITY CODE <span className="text-red-500">*</span>
							</label>
							<input
								type="text"
								name="securityCode"
								value={cardData.securityCode}
								onChange={handleInputChange}
								className={`w-full p-2 border rounded ${errors.securityCode ? 'border-red-500' : ''}`}
								placeholder="CVC"
							/>
							{errors.securityCode && (
								<p className="text-red-500 text-xs mt-1">{errors.securityCode}</p>
							)}
						</div>
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-1">
							NAME ON CARD <span className="text-red-500">*</span>
						</label>
						<input
							type="text"
							name="nameOnCard"
							value={cardData.nameOnCard}
							onChange={handleInputChange}
							className={`w-full p-2 border rounded ${errors.nameOnCard ? 'border-red-500' : ''}`}
							placeholder="Name on Card"
						/>
						{errors.nameOnCard && (
							<p className="text-red-500 text-xs mt-1">{errors.nameOnCard}</p>
						)}
					</div>

					<div className="flex flex-col sm:flex-row justify-end mt-4 gap-2">
						{initialData && (
							<button
								type="button"
								onClick={() => setIsEditing(false)}
								className="px-4 py-2 border rounded text-gray-600 w-full sm:w-auto order-2 sm:order-1"
							>
								Cancel
							</button>
						)}
						<button
							type="button"
							onClick={handleSave}
							disabled={isSaving}
							className={`bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto order-1 sm:order-2 ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
						>
							{isSaving ? (
								<>
									<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
									</svg>
									Saving...
								</>
							) : "Save Card"}
						</button>
					</div>
				</form>
			) : (
				<div className="space-y-3">
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
						<div className="flex items-center">
							<svg className="h-6 w-6 sm:h-8 sm:w-8 mr-2 text-gray-500" viewBox="0 0 24 24" fill="currentColor">
								<path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z"/>
							</svg>
							<span className="font-medium text-sm sm:text-base">{formatCardNumber(cardData.cardNumber)}</span>
						</div>
						<div className="mt-2 sm:mt-0">
							{isDefault ? (
								<span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">Default</span>
							) : (
								<button 
									onClick={onSetDefault}
									className="text-xs text-blue-600 hover:text-blue-800"
								>
									Set as default
								</button>
							)}
						</div>
					</div>
					<div className="text-xs sm:text-sm text-gray-600 ml-6 sm:ml-10">
						<p>Expires: {cardData.expirationDate}</p>
						<p>{cardData.nameOnCard}</p>
					</div>
				</div>
			)}
		</div>
	);
}

export default PaymentCard;