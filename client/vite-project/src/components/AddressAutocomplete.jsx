import React, { useEffect } from 'react';
import usePlacesAutocomplete, { getGeocode, getLatLng } from 'use-places-autocomplete';

const AddressAutocomplete = ({ onSelect, label, placeholder, initialValue }) => {
    const {
        ready,
        value,
        suggestions: { status, data },
        setValue,
        clearSuggestions,
    } = usePlacesAutocomplete({
        requestOptions: {
            
            componentRestrictions: { country: 'in' }, 
        },
        debounce: 300,
    });

    useEffect(() => {
        if (initialValue) {
            setValue(initialValue, false);
        }
    }, [initialValue, setValue]);

    const handleInput = (e) => {
        setValue(e.target.value);
    };

    const handleSelect = async ({ description }) => {
        setValue(description, false);
        clearSuggestions();

        try {
            const results = await getGeocode({ address: description });
            const { lat, lng } = await getLatLng(results[0]);

            
            onSelect({ address: description, lat, lng });
        } catch (error) {
            console.error('Error: ', error);
        }
    };

    return (
        <div className="relative">
            <label className="block text-gray-700 text-sm font-bold mb-2">
                {label}
            </label>
            <input
                value={value}
                onChange={handleInput}
                disabled={!ready}
                placeholder={placeholder}
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />

            {status === 'OK' && (
                <ul className="absolute z-50 bg-white border border-gray-200 w-full mt-1 rounded shadow-lg max-h-60 overflow-y-auto">
                    {data.map(({ place_id, description }) => (
                        <li
                            key={place_id}
                            onClick={() => handleSelect({ description })}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm text-gray-700"
                        >
                            {description}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AddressAutocomplete;
