import { ValidationError } from '../../shared/errors'

export interface AddressProps {
	street: string
	city: string
	province: string
	postalCode: string
	country: string
	contactName?: string
	contactPhone?: string
}

export class Address {
	private constructor(
		private readonly _street: string,
		private readonly _city: string,
		private readonly _province: string,
		private readonly _postalCode: string,
		private readonly _country: string,
		private readonly _contactName?: string,
		private readonly _contactPhone?: string
	) {}

	static create(props: AddressProps): Address {
		if (!props.street?.trim()) {
			throw new ValidationError('Street address is required', 'street')
		}
		if (!props.city?.trim()) {
			throw new ValidationError('City is required', 'city')
		}
		if (!props.province?.trim()) {
			throw new ValidationError('Province is required', 'province')
		}
		if (!props.postalCode?.trim()) {
			throw new ValidationError('Postal code is required', 'postalCode')
		}
		if (!props.country?.trim()) {
			throw new ValidationError('Country is required', 'country')
		}

		return new Address(
			props.street.trim(),
			props.city.trim(),
			props.province.trim(),
			props.postalCode.trim(),
			props.country.trim(),
			props.contactName?.trim(),
			props.contactPhone?.trim()
		)
	}

	get street(): string {
		return this._street
	}
	get city(): string {
		return this._city
	}
	get province(): string {
		return this._province
	}
	get postalCode(): string {
		return this._postalCode
	}
	get country(): string {
		return this._country
	}
	get contactName(): string | undefined {
		return this._contactName
	}
	get contactPhone(): string | undefined {
		return this._contactPhone
	}

	toFullAddress(): string {
		return `${this._street}, ${this._city}, ${this._province} ${this._postalCode}, ${this._country}`
	}

	equals(other: Address): boolean {
		return (
			this._street === other._street &&
			this._city === other._city &&
			this._province === other._province &&
			this._postalCode === other._postalCode &&
			this._country === other._country
		)
	}

	toJSON(): AddressProps {
		return {
			street: this._street,
			city: this._city,
			province: this._province,
			postalCode: this._postalCode,
			country: this._country,
			contactName: this._contactName,
			contactPhone: this._contactPhone
		}
	}
}
