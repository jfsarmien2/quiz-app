import axios from 'axios'
import React, { useState, useContext, useEffect } from 'react'

const table = {
  sports: 21,
  history: 23,
  politics: 24,
}

const API_ENDPOINT = 'https://opentdb.com/api.php?'

const url = ''
const tempUrl = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple'
const AppContext = React.createContext()

const AppProvider = ({ children }) => {
  const [waiting, setWaiting] = useState(true)
  const [loading, setLoading] = useState(false)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [error, setError] = useState(false)
  const [quiz, setQuiz] = useState({
    amount: 10,
    category: 'sport',
    difficulty: 'easy'
  })

  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchQuestions = async (url) => {
    setLoading(true)
    setWaiting(false)

    const response = await axios(url).catch((error) => console.log(error))
    
    if(response) {
      const data = response.data.results
      
      if(data.length > 0) {
        setQuestions(data)
        setLoading(false)
        setWaiting(false)
      } else {
        setWaiting(true)
        setLoading(false)
        setError(true)
      }
    } else {
      setWaiting(true)
    }
  }

  const nextQuestion = () => {
    setIndex((oldIndex) => {
        const index = oldIndex + 1
        if(index > questions.length -1) {
          openModal()
            return 0
        }
        return index
    })
  }

  const checkAnswer = value => {
     if(value) {
        setCorrect((prevState) => prevState + 1)
     }

     nextQuestion()
  }

  const openModal = () => {
    setIsModalOpen(true)
  }
  const closeModal = () => {
    setWaiting(true)
    setCorrect(0)
    setIsModalOpen(false)
  }
  
  const handleChange = (e) => {
    const name = e.target.name
    const value = e.target.value
    setQuiz({...quiz, [name]: value})
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const { amount, category, difficulty } = quiz

    const url = `${API_ENDPOINT}amount=${amount}&difficulty=${difficulty}&category=${table[category]}&type=multiple`
    fetchQuestions(url)
  }
  return (
    <AppContext.Provider 
      value={{
        waiting,
        loading,
        questions,
        index,
        correct,
        error,
        isModalOpen,
        nextQuestion,
        checkAnswer,
        closeModal,
        quiz,
        handleChange,
        handleSubmit
      }}
    >
      {children}
    </AppContext.Provider>
    )
}

export const useGlobalContext = () => {
  return useContext(AppContext)
}

export { AppContext, AppProvider }
