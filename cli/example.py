import graphviz
# 
# Create a new graph
graph = graphviz.Digraph(format='png')

# Add nodes to the graph
graph.node('joao')
graph.node('maria')
graph.node('joana')
graph.node('vinicius')
graph.node('joao_vinicius')

# Add edges to the graph
graph.edge('joao', 'joana')
graph.edge('maria', 'joana')
graph.edge('joana', 'joao_vinicius')
graph.edge('vinicius', 'joao_vinicius')

# Save the graph to a file
graph.render('graph', view=False)


import graphviz
from PIL import Image
import numpy as np

# # Create a new directed graph
# graph = graphviz.Digraph(format='png')
# 
# # Add nodes to the graph
# graph.node('A')
# graph.node('B')
# graph.node('C')
# graph.node('D')
# 
# # Add directed edges to the graph
# graph.edge('A', 'B')
# graph.edge('B', 'C')
# graph.edge('C', 'D')
# graph.edge('D', 'A')
# 
# # Save the graph to a file
# graph.render('graph', view=False)

# Read the generated image using PIL
image = Image.open('graph.png')
image = image.convert('L')  # Convert to grayscale

# Threshold the image
threshold = 100 
image = image.point(lambda p: p < threshold and 255)

# Downscale the image
downscale_factor = 2
downscaled_image = image.resize((image.width // downscale_factor, image.height // downscale_factor))

# Convert the downscaled image to a numpy array
array = np.array(downscaled_image)

# Define ASCII characters representing different grayscale values
ascii_chars = '@%#*+=-:.'
ascii_chars = '##....:  '

# Convert the grayscale values to ASCII characters
ascii_array = []
for row in array:
    ascii_row = [ascii_chars[pixel // 32] for pixel in row]
    ascii_array.append(''.join(ascii_row))

# Print the ASCII array
for row in ascii_array:
    print(row)
