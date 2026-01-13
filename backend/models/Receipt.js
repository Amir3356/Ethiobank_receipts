class Receipt {
  constructor(data) {
    this.id = data.id || null;
    this.bank = data.bank || '';
    this.amount = data.amount || 0;
    this.date = data.date || new Date();
    this.sender = data.sender || '';
    this.receiver = data.receiver || '';
    this.reference = data.reference || '';
    this.rawText = data.rawText || '';
    this.createdAt = data.createdAt || new Date();
  }

  static validate(data) {
    const errors = [];
    if (!data.bank) errors.push('Bank is required');
    if (!data.url) errors.push('URL is required');
    return { isValid: errors.length === 0, errors };
  }

  toJSON() {
    return {
      id: this.id,
      bank: this.bank,
      amount: this.amount,
      date: this.date,
      sender: this.sender,
      receiver: this.receiver,
      reference: this.reference,
      createdAt: this.createdAt
    };
  }
}

export default Receipt;
