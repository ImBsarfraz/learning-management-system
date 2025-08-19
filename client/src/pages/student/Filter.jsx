import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import React, { useState } from 'react'

const categories = [
    {
        id: "fullstack", label: "Full Stack",
    },
    {
        id: "mean-stack", label: "MEAN Stack",
    },
    {
        id: "mern-stack", label: "MERN Stack",
    },
    {
        id: "frontend", label: "Frontend",
    },
    {
        id: "backend", label: "Backend",
    },
    {
        id: "database", label: "Database",
    },
    {
        id: "programming", label: "Programming",
    },
    {
        id: "tool", label: "Tool",
    },
    {
        id: "other", label: "Other",
    }
]

const Filter = ({ handleFilterChange }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [sortByPrice, setSortByPrice] = useState("");

    const handleCategoryChange = (categoryId) => {
        setSelectedCategories((prevCategories) => {
            const latestCategories =
                prevCategories.includes(categoryId) ?
                    prevCategories.filter((id) => id !== categoryId) :
                    [...prevCategories, categoryId];
            handleFilterChange(latestCategories, sortByPrice);
            return latestCategories;
        })
    }

    const selectByPriceHandler = (selectedValue) => {
        setSortByPrice(selectedValue);
        handleFilterChange(selectedCategories, selectedValue);
    }

    return (
        <div className='w-full md:w-[20%]'>
            <div className='flex items-center justify-between'>
                <h1 className='font-semibold text-lg md:text-xl'>Filter Options</h1>
                <Select oncValueChange={selectByPriceHandler}>
                    <SelectTrigger>
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sort By Price</SelectLabel>
                            <SelectItem value="low">Low to high</SelectItem>
                            <SelectItem value="high">High to low</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <Separator className="my-4" />
            <div>
                <h1 className='font-semibold mb-2'>Category</h1>
                {
                    categories.map((category) => (
                        <div className='flex items-center space-x-2 my-2'>
                            <Checkbox id={category.id} onCheckedChange={() => handleCategoryChange(category.id)} />
                            <Label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">{category.label}</Label>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Filter