import { useEffect, useState } from 'react'

import Header from '../../components/Header'
import { api } from '../../services/api'
import { Food } from '../../components/Food/index'
import ModalAddFood from '../../components/ModalAddFood'
import ModalEditFood from '../../components/ModalEditFood'
import { FoodType } from '../../types/FoodType'
import { FoodsContainer } from './styles'

export const Dashboard = () => {
  const [foods, setFoods] = useState<FoodType[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [editModalOpen, setEditeModalOpen] = useState(false)

  const [editingFood, setEditingFood] = useState<FoodType>({} as FoodType)

  useEffect(() => {
    async function getFoods() {
      const response = await api.get('/foods')

      setFoods(response.data)
    }

    getFoods()
  }, [])

  const handleAddFood = async (food: FoodType) => {
    try {
      const response = await api.post('/foods', {
        ...food,
        available: true
      })

      setFoods(oldArray => [...oldArray, response.data])
    } catch (err) {
      console.log(err)
    }
  }

  const handleUpdateFood = async (food: FoodType) => {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, {
        ...food
      })

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data
      )

      setFoods(foodsUpdated)
    } catch (err) {
      console.log(err)
    }
  }

  const handleDeleteFood = async (id: number) => {
    await api.delete(`/foods/${id}`)

    const foodsFiltered = foods.filter(food => food.id !== id)

    setFoods(foodsFiltered)
  }

  const toggleModal = () => {
    setModalOpen(!modalOpen)
  }

  const toggleEditModal = () => {
    setEditeModalOpen(!editModalOpen)
  }

  const handleEditFood = (food: FoodType) => {
    setEditeModalOpen(true)
    setEditingFood(food)
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  )
}
