import { LineChart, PieChart, BarChart } from 'react-native-chart-kit'
import { Dimensions, Text } from 'react-native'
import { useEffect, useState } from 'react'
import tw from 'twrnc'
import client from '../client'

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 2,
  barPercentage: 1,
  useShadowColorFromDataset: false,
}

export default function Chart({ index }) {
  const screenWidth = Dimensions.get('window').width
  const [render1, setRender1] = useState()
  const [render2, setRender2] = useState()
  const [render3, setRender3] = useState()
  const [render4, setRender4] = useState()
  const [render5, setRender5] = useState()

  useEffect(() => {
    async function onFetch() {
      if (!index) return
      let topic
      switch (index) {
        case 1:
          topic = 'popularity'
          break
        case 2:
          topic = 'popularity/average'
          break
        case 3:
          topic = 'type'
          break
        case 4:
          topic = 'price'
          break
        case 5:
          topic = 'spicyness'
          break
      }
      const response = await client.get(`/ratio/${topic}`)
      if (index === 1) {
        const labels = response.data.map((data) =>
          data.average_price.toFixed(2),
        )
        const data = response.data.map((data) => data.popularity)
        setRender1({
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        })
      }
      if (index === 2) {
        const labels = []
        const data = []
        for (const [key, value] of Object.entries(response.data.results)) {
          labels.push(key)
          data.push(value)
        }
        setRender2({
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        })
      }
      if (index === 3) {
        const labels = response.data.map((data) => data.type)
        const data = response.data.map((data) => data.percent)
        setRender3({
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        })
      }
      if (index === 4) {
        const labels = []
        const data = []
        for (const [key, value] of Object.entries(response.data.results)) {
          labels.push(key)
          data.push(value)
        }
        setRender4({
          labels: labels,
          datasets: [
            {
              data: data,
            },
          ],
        })
      }
      if (index === 5) {
        setRender5([
          {
            name: response.data[0].name,
            population: response.data[0].percent,
            color: 'rgba(131, 167, 234, 1)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
          {
            name: response.data[1].name,
            population: response.data[1].percent,
            color: 'rgba(255, 0,0, 0.6)',
            legendFontColor: '#7F7F7F',
            legendFontSize: 15,
          },
        ])
      }
    }
    onFetch()
  }, [index])

  if (index === 1) {
    if (!render1) return

    return (
      <LineChart
        data={render1}
        width={screenWidth}
        height={250}
        chartConfig={chartConfig}
        withInnerLines={false}
      />
    )
  }

  if (index === 2) {
    if (!render2) return

    return (
      <LineChart
        data={render2}
        width={screenWidth}
        height={250}
        chartConfig={chartConfig}
        withInnerLines={false}
      />
    )
  }

  if (index === 3) {
    if (!render3) return

    return (
      <LineChart
        data={render3}
        width={screenWidth}
        height={250}
        chartConfig={chartConfig}
      />
    )
  }

  if (index === 4) {
    if (!render4) return

    return (
      <BarChart
        data={render4}
        width={screenWidth}
        height={220}
        chartConfig={chartConfig}
        verticalLabelRotation={0}
      />
    )
  }

  if (index === 5) {
    if (!render5) return

    return (
      <PieChart
        data={render5}
        width={screenWidth}
        height={250}
        chartConfig={chartConfig}
        accessor={'population'}
        backgroundColor={'transparent'}
      />
    )
  }

  return (
    <Text style={tw`mt-6 text-lg text-center`}>
      Select Data to visualization...
    </Text>
  )
}
