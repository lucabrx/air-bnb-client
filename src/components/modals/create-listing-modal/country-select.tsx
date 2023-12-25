"use client"

import Select from "react-select"

import useCountries from "~/hooks/use-countries"

export type CountrySelectValue = {
  flag: string
  label: string
  latlng: number[]
  region: string
  value: string
}

interface CountrySelectProps {
  value?: CountrySelectValue
  onChange: (value: CountrySelectValue) => void
}

function CountrySelect({ value, onChange }: CountrySelectProps) {
  const { getAll } = useCountries()

  return (
    <div className="z-50 my-2">
      <Select
        placeholder="Anywhere"
        isClearable
        options={getAll()}
        defaultValue={getAll()[0]}
        value={value}
        onChange={(value) => onChange(value!)}
        formatOptionLabel={(option: CountrySelectValue) => (
          <div
            className="
           flex flex-row items-center gap-3"
          >
            <div>{option.flag}</div>
            <div>
              {option.label},<span className="ml-1 text-neutral-500">{option.region}</span>
            </div>
          </div>
        )}
        classNames={{
          control: () => "p-1 border-2",
          input: () => "text-lg",
          option: () => "text-lg",
        }}
        theme={(theme) => ({
          ...theme,
          borderRadius: 6,
          colors: {
            ...theme.colors,
            primary: "black",
            primary25: "#ffe4e6",
          },
        })}
      />
    </div>
  )
}

export default CountrySelect
