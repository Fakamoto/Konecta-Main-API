import os
import openai
import sys

openai.api_key = "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"

start_sequence = "\nAI:"
restart_sequence = "\nHuman: "

response = openai.Completion.create(
      model="text-davinci-003",
      prompt=sys.argv[1],
      temperature=0.9,
      max_tokens=150,
      top_p=1,
      frequency_penalty=0,
      presence_penalty=0.6,
      stop=[" Human:", " AI:"]
)

text = response
print(text)
