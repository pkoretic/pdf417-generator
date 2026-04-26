/**
 * HUB3 - Croatian payment slip barcode data formatter
 *
 * Formats structured payment data into the HRVHUB30 string required by PDF417.draw().
 *
 * Field length limits follow the HUB-3A standard:
 *   payerName      max 30 characters
 *   payerAddress   max 27 characters
 *   payerCity      max 27 characters
 *   recipientName  max 25 characters
 *   recipientAddr  max 25 characters
 *   recipientCity  max 27 characters
 *   iban           21 characters (HR + 19 digits)
 *   model          4 characters (e.g. "HR01", "HR99")
 *   callNumber     max 22 characters (poziv na broj primatelja)
 *   purposeCode    4 characters (SEPA purpose code, e.g. "COST")
 *   description    max 35 characters
 */
var HUB3 = {

    /**
     * Build a HRVHUB30 payload string from a payment data object.
     *
     * @param {Object} data
     * @param {number|string} data.amount         Amount in EUR (e.g. 123.45)
     * @param {string}        data.payerName      Payer full name
     * @param {string}        data.payerAddress   Payer street address
     * @param {string}        data.payerCity      Payer postal code + city (e.g. "10000 Zagreb")
     * @param {string}        data.recipientName  Recipient full name
     * @param {string}        data.recipientAddr  Recipient street address
     * @param {string}        data.recipientCity  Recipient postal code + city
     * @param {string}        data.iban           Recipient IBAN (e.g. "HR1210010051863000160")
     * @param {string}        data.model          Payment model (e.g. "HR01", "HR99")
     * @param {string}        data.callNumber     Reference number (poziv na broj)
     * @param {string}        data.purposeCode    SEPA purpose code (e.g. "COST")
     * @param {string}        data.description    Payment description
     * @returns {string}  Formatted HRVHUB30 string ready to pass to PDF417.draw()
     */
    format: function(data) {
        HUB3._validate(data)

        var amount = HUB3._formatAmount(data.amount)

        return [
            'HRVHUB30',
            'EUR',
            amount,
            data.payerName.substring(0, 30),
            data.payerAddress.substring(0, 27),
            data.payerCity.substring(0, 27),
            data.recipientName.substring(0, 25),
            data.recipientAddr.substring(0, 25),
            data.recipientCity.substring(0, 27),
            data.iban.replace(/\s/g, '').substring(0, 21),
            (data.model || '').substring(0, 4),
            (data.callNumber || '').substring(0, 22),
            (data.purposeCode || '').substring(0, 4),
            (data.description || '').substring(0, 35)
        ].join('\n') + '\n'
    },

    /**
     * Format a decimal amount to the 15-digit cent string required by the standard.
     * Example: 123.45 -> "000000000012345"
     */
    _formatAmount: function(amount) {
        var cents = Math.round(parseFloat(amount) * 100)
        if (isNaN(cents) || cents < 0) throw new Error('HUB3: invalid amount')
        var str = String(cents)
        if (str.length > 15) throw new Error('HUB3: amount too large')
        return str.padStart(15, '0')
    },

    _validate: function(data) {
        var required = ['amount', 'payerName', 'payerAddress', 'payerCity',
                        'recipientName', 'recipientAddr', 'recipientCity', 'iban']
        required.forEach(function(field) {
            if (data[field] == null || String(data[field]).trim() === '')
                throw new Error('HUB3: missing required field: ' + field)
        })

        var iban = data.iban.replace(/\s/g, '')
        if (!/^HR\d{19}$/.test(iban))
            throw new Error('HUB3: iban must be a 21-character Croatian IBAN (HR + 19 digits)')
    }
}

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined')
    module.exports = HUB3
