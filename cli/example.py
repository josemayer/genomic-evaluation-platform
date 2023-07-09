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
