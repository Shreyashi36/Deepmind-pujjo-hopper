import json
import re
import csv
import random

raw_text = """
1	108 Shiv Mandir Barwari Samity 2026	Other Zone
2	14 Pally Udayan Sangha 2026	Central Kolkata
3	2 No Basudebpur Sarbojanin Durga Puja 2026	Behala
4	21 Pally Sarbojanin Durgotsab Samiti 2026	South Kolkata
5	22 Palli Sarodotsav 2026	South Kolkata
6	23 Pally Sarbojanin Durgotsab 2026	South 24 Parganas
7	25 Pally Durga Puja 2026	South Kolkata
8	31 Pally Sadharan Durgotsab Samity 2026	North Kolkata
9	37 Pally Sarbojanin Durgotsab 2026	Central Kolkata
10	47 Pally Jubak Brinda Durga Puja 2026	Central Kolkata
11	64 Pally Durgotsab Committee 2026	South Kolkata
12	66 Pally Sarbojanin Durgotsab Committee 2026	South Kolkata
13	70 Pally Sarbojanin Durga Puja 2026	South Kolkata
14	7er Pally Sarbojanin Durga Puja Committee 2026	Behala
15	95 Pally Jodhpur Park Durga Puja 2026	South Kolkata
16	Abasar Sarbojanin Durgotsab Committee 2026	South Kolkata
17	Abasorika Durgotsav Committee 2026	South Kolkata
18	Acharya Prafulla Sangha 2026	Behala
19	Adi Ballygunge Sarbojanin Durga Puja 2026	South Kolkata
20	Adi Dakshin Kalikata Barowari Samittee 2026	South Kolkata
21	Agradut Udaya Sangha Durga Puja 2026	South Kolkata
22	Ahiritola Jubak Brinda Durga Puja 2026	North Kolkata
23	Airport Enclave Residents Committee 2026	North 24 Parganas
24	AJ Block Durga Puja 2026	Salt Lake
25	Ajeya Sanghati Durga Puja 2026	Behala
26	Ambagan Durga Puja Committee 2026	North 24 Parganas
27	Amherst Sarbojanin Durgotsab 2026	North Kolkata
28	Arabinda Nagar Arabinda Sangha Sarbojanin Durga Utsav 2026	Howrah
29	Arunodaya Adhibashi Brinder Durga Puja 2026	South Kolkata
30	Arupara Sarbojanin Durgotsab Committee 2026	Howrah
31	Aswiningar Sarbojanin Durgotsav 2026	North Kolkata
32	Atghara Noapara Baroary Durga Puja 2026	North 24 Parganas
33	Avijan Gandhi Colony 2026	South Kolkata
34	Azad Hind Sangha Durga Puja 2026	Howrah
35	Babu Bagan Durga Puja 2026	South Kolkata
36	Bachhri Durga Puja 2026	Howrah
37	Badamtala Ashar Sangha Durga Puja 2026	South Kolkata
38	Baghajatin B and C Block Durgotsav Committee 2026	South Kolkata
39	Baghajatin Tarun Sangha Durgotsav 2026	South Kolkata
40	Baghbazar Palli Puja O Pradarshani 2026	North Kolkata
41	Bagnan Nabaneer Club Durga Puja 2026	Howrah
42	Baidyabati Sakti Sangha 2026	Hooghly
43	Baisakhi Sangha 2026	Other Zone
44	Baishnabghata Paschimpara Sarbojanin Durgotsab 2026	South Kolkata
45	Balaka Sangha Durga Puja 2026	Other Zone
46	Balitikuri Netaji Balak Sangha 2026	Howrah
47	Ballygunge Cultural Association Durga Puja 2026	South Kolkata
48	Ballygunge Pally Sarbojanin Durgotsab Committee 2026	South Kolkata
49	Bandhudal Durgotsob 2026	North Kolkata
50	Banerjeepara Sarbojanin 2026	North 24 Parganas
51	Bangur Park Durgotsav Committee 2026	Hooghly
52	Bansdroni Sammilita Sarbojanin Durgotsab Committee 2026	South Kolkata
53	Bansdroni Shanti Sangha 2026	South 24 Parganas
54	Bantra Mohila Sangha Durga Puja 2026	Howrah
55	Bantra Nabin Sangha Durga Puja 2026	Howrah
56	Barisha Kumarpara Youngs' Club Durga Puja 2026	Behala
57	Barisha Maitree Sangha Durgotsab 2026	Behala
58	Barisha Milani Sangha Durga Puja 2026	Behala
59	Barisha Netaji Sangha Durga Puja 2026	Behala
60	Barisha Sarbojanin Durgotsab 2026	Behala
61	Barisha Saterpalli Sammilani Durga Puja 2026	Behala
62	Basupara Durga Puja Committee 2026	Other Zone
63	Batore 41er Pally Sarbojanin 2026	Howrah
64	BD Block Sarbojanin Durgotsab Committee 2026	Salt Lake
65	Beadon Street Sarbojanin Durgotsav 2026	North Kolkata
66	Bediadanga Sarbojanin Durgotsav Committee 2026	South Kolkata
67	Behala 11 Pally Durga Puja 2026	Behala
68	Behala Arunoday Samity 2026	Behala
69	Behala Buroshibtala Janakalyan Sangha Durga Puja 2026	Behala
70	Behala Debdaru Fatak Durga Puja 2026	Behala
71	Behala Mitra Sangha Durga Puja 2026	Behala
72	Behala Mukul Sangha Durgotsab 2026	Behala
73	Beleghata Sarkar Bazar Durga Puja 2026	East Kolkata
74	Belepole Adams Club 2026	Howrah
75	Belgachia Sadharan Durgotsab 2026	North Kolkata
76	Belgachia Yuba Sammilani Durga Puja 2026	North Kolkata
77	Beliaghata 33 Palli Durga Puja 2026	East Kolkata
78	Beltala Sarbojanin Durgotsab 2026	South Kolkata
79	Bengal United Club Durga Puja 2026	South Kolkata
80	Bengali Association Durga Puja 2026	Other Zone
81	Bhagabati Park Durga Puja Committee 2026	North Kolkata
82	Bharatiya Tarun Sangha Durga Puja 2026	North Kolkata
83	Bhawanipore Mahapuja Samity 2026	South Kolkata
84	Bhowanipore De Bari Durga Puja 2026	South Kolkata
85	Bhowanipore Mitra Bari Durga Puja 2026	South Kolkata
86	Bhowanipur 75 Palli Durga Puja 2026	South Kolkata
87	Bhowanipur Muktadal Durga Puja 2026	South Kolkata
88	Bhowanipur Ritwik Club Durga Puja Committee 2026	South Kolkata
89	Bhowanipur Sarbojanin Durgotsav 2026	South Kolkata
90	Bhowanipur Students Club Sarbojanin Durga Puja 2026	South Kolkata
91	Bhowanipur Swadhin Sangha Durga Puja 2026	South Kolkata
92	Bhowanipur Udayan Club Durga Puja 2026	South Kolkata
93	Bidhan Nagar South Atheletics Club 2026	South Kolkata
94	Bidhannagar Purba Sarbojanin Durgotsab 2026	Other Zone
95	Bidhanpally Purbapara Sarbojanin 2026	South Kolkata
96	Bishalaxmitala Sarbojanin Durga Puja 2026	Behala
97	Biswanath Abasan Sharodotsav 2026	North 24 Parganas
98	Biswanath Apartment Sharodutsab 2026	North Kolkata
99	BJ Block Saradotsav Committee 2026	Salt Lake
100	BL Block Durga Puja 2026	Salt Lake
101	Bosepukur Talbagan Sarbojanin 2026	South Kolkata
102	Brahmapur Boral Sarbojanin Durgotsab 2026	South 24 Parganas
103	Brahmapur Harisava Sarbojanin Durgotsab 2026	South Kolkata
104	Brahmapur Sarbojanin Durgotsab 2026	South 24 Parganas
105	Brindaban Matri Mandir Durga Puja 2026	North Kolkata
106	Brindabon Netaji Balak Sangha Durga Puja 2026	Howrah
107	Cactus Sharad Utsav 2026	Other Zone
108	Calcutta Youth Forum 2026	North Kolkata
109	Campbagan Sadharan Durgotsav 2026	North Kolkata
110	Central Calcutta Youth Association 2026	Central Kolkata
111	Chaltabagan Lohapatty Durga Puja 2026	North Kolkata
112	Chandannagar Nabagram Sarbojanin 2026	Hooghly
113	Charer Palli Sarbojanin Durgotsab 2026	North Kolkata
114	Chetla Agrani Club Durga Puja 2026	South Kolkata
115	Chetla Sarbasadharaner Durgotsab 2026	South Kolkata
116	Chitrakut Dham Durga Puja 2026	North 24 Parganas
117	Chorebagan Sarbojanin Durgotsab Samity 2026	North Kolkata
118	Coal India Puja Committee Durga Puja 2026	South Kolkata
119	College Square Sarbojanin Durgotsav 2026	Central Kolkata
120	Cossipore Shakti Sangha Durga Puja 2026	North Kolkata
121	Dakshin Kolkata Sarbojanin Durgotsab 2026	South Kolkata
122	Dakshin Kolkata Tarun Samity Durga Puja 2026	South Kolkata
123	Dakshin Rabindrapally Sarbojanin Durga Puja 2026	North Kolkata
124	Dankuni Milonee Unnayan Samity 2026	Hooghly
125	Dankuni Sarbojanin Shree Shree Durgotsab 2026	Hooghly
126	Darjeepara Sarbojanin Durgotsab Samity 2026	North Kolkata
127	Daspara Panch Bhai Sangha 2026	Howrah
128	Debendra Nagar Sarbojanin 2026	North 24 Parganas
129	Deshapriya Park Durga Puja 2026	South Kolkata
130	Deshbandhunagar Sarbojanin Durgotsab 2026	North Kolkata
131	Dhakuria Pragati Sangha Durga Puja 2026	South Kolkata
132	Dhakuria Sarbojanin Durgotsab 2026	South Kolkata
133	Dharmatala Durga Puja 2026	Howrah
134	Dishari Sangha Sarbojanin Durgotsab 2026	Other Zone
135	Dum Dum Park Bharat Chakra Durga Puja 2026	North Kolkata
136	Dum Dum Park Sarbojanin Durga Puja 2026	North Kolkata
137	Durbar Mahila Samanya Committee 2026	North Kolkata
138	Ekdalia Evergreen Club Durga Puja 2026	South Kolkata
139	EKTP Phase 2 Abasik Puja Samity 2026	East Kolkata
140	Entally Matribhumi Durga Puja 2026	Central Kolkata
141	Entally Sarbojanin Sri Sri Durga Puja 2026	Central Kolkata
142	Falguni Sangha Durga Puja 2026	South Kolkata
143	Garden Lane Sarbojanin Durgotsab 2026	North Kolkata
144	Garfa Sarbojanin Durgotsav 2026	South Kolkata
145	Genexx Valley Durga Puja 2026	Behala
146	Ghoshpara Sankalpa Sangha Durga Puja 2026	Howrah
147	Ghoshpara Young Stars Durga Puja 2026	Howrah
148	Goabagan Sarodatsav Sammilani Durga Puja 2026	North Kolkata
149	Goala Para Five Star Sporting Club 2026	South Kolkata
150	Golaghata Sammilani Durga Puja 2026	North Kolkata
151	Golpark Sarbojanin Durgotsab Committee 2026	South Kolkata
152	Gopal Nagar Kalyan Sangha Durga Puja 2026	South Kolkata
153	Gour Hari Sriti Sangha 2026	Other Zone
154	Grey Street Sarbojanin Durga Puja 2026	North Kolkata
155	Guha Road Sarbojanin Mahapuja 2026	Howrah
156	Habichak Sabojanin Durgoutsab 2026	Other Zone
157	Halsibagan Sarbojanin Durgotsab 2026	North Kolkata
158	Hari Ghosh Street Sarbojanin 2026	North Kolkata
159	Hari Ghosh Street Swamiji Sangha Sarbojanin Durga Puja 2026	North Kolkata
160	Haridevpur New Sporting Club Durga Puja 2026	Behala
161	Harindanga Milan Sangha Sarbojanin 2026	South 24 Parganas
162	Harish Park Sarbojanin Durgotsab Samity 2026	South Kolkata
163	Haritaki Bagan Sarbojanin Durgotsab 2026	North Kolkata
164	Haru Chandra Sporting Club 2026	Behala
165	Hatibagan Nabinpally Sarbojanin Durgotsav 2026	North Kolkata
166	Himachal Sangha Durga Puja 2026	Other Zone
167	Hindustan Pally Durga Puja Committee 2026	South Kolkata
168	Howrah Jatiya Sevadal Club Durga Puja 2026	Howrah
169	Ichapur Bayam Samity Durga Puja 2026	Howrah
170	Ichapur Mitali Sangha Durga Puja 2026	Howrah
171	Ichapur Sanghamitra Durga Puja 2026	Howrah
172	Ichlabad Youth Club Durga Puja 2026	Other Zone
173	Interact Club of Chowringhee High School Sarbojanin Durga Puja 2026	Central Kolkata
174	Jagaran Club Durga Puja 2026	South Kolkata
175	Jagat Mukherjee Park Durga Puja 2026	North Kolkata
176	Jaigaon Youth Ujjawal Club 2026	Other Zone
177	Jawpur Bayam Samity Durga Puja 2026	East Kolkata
178	Jayasree Sarbojanin Durgotsab Samity 2026	Behala
179	Jhikurberia Sarbojanin Durga Puja 2026	South 24 Parganas
180	Jhorehat Pachal Para Puja Committee 2026	Howrah
181	Jokermath Sarbojonin Durga Puja 2026	North Kolkata
182	Joyrampur Sarbojanin Durga Puja Committee 2026	Behala
183	Jubamaitry Kalighat Durga Puja 2026	South Kolkata
184	Judge Bagan Sarbojanin Durgotsab 2026	East Kolkata
185	Kailash Bose Street Durga Puja 2026	North Kolkata
186	Kalighat Nepal Bhattacharjee Street Club 2026	South Kolkata
187	Kalitala Sarbojanin Durgotsab Committee 2026	Other Zone
188	Kamardanga Sisu Sangha Durga Puja 2026	Howrah
189	Kamardanga Sitalatala Barowari Durga Puja 2026	Howrah
190	Kanai Dhar Lane Adhibasi Brinda 2026	Central Kolkata
191	Kanjial Para Puja Samity Durga Puja 2026	East Kolkata
192	Kankurgachi Sarbojanin Durgotsab 2026	North Kolkata
193	Kansaripara Sarbojanin Sarodotsab Committee 2026	South Kolkata
194	Kantore Milan Sangha Durga Puja 2026	Other Zone
195	Kasba R.K. Chatterjee Road Adhibasi Brinda Durga Puja 2026	South Kolkata
196	Kasba Renaissance Club 2026	South Kolkata
197	Kasba Shakti Sangha Pallybasi Durgotsav Samity 2026	South Kolkata
198	Kashi Bose Lane Durga Puja Committee 2026	North Kolkata
199	Kashipur Yubo Gosthi 2026	Howrah
200	Kazi Bagan Lane Durga Puja 2026	Howrah
201	Keota Nabin Sangha 2026	Hooghly
202	Ketopole Sammilani Durga Puja 2026	South Kolkata
203	Keyatala Pally Samity Durga Puja 2026	South Kolkata
204	Khamarkur Durga Puja 2026	South 24 Parganas
205	Kheyali Sangha Durga Puja 2026	South Kolkata
206	Khidderpore Sarbojanin Durgotsab 2026	South Kolkata
207	Khidderpur 75 Pally Sarbojanin Durgotsab Committee 2026	South Kolkata
208	Kidderpore Jubaghosthi Durga Puja 2026	South Kolkata
209	Kidderpore Pally Saradiya Durga Puja 2026	South Kolkata
210	Kishor Sangsad Club Durga Puja 2026	Howrah
211	Kishorepur Sarbojanin Durgotsab 2026	Hooghly
212	Krishnanagar Club Durga Puja 2026	Other Zone
213	KTPP Officers Club Durgotsab 2026	Other Zone
214	Kumartuli Park Sarbojanin Durgotsab Committee 2026	North Kolkata
215	Kumartuli Sarbojanin Durgotsab 2026	North Kolkata
216	Kustar Sarbojanin Durga Puja 2026	Other Zone
217	Lahiri Para Sarbojanin Durgotsav 2026	Hooghly
218	Lake Gardens Peoples Association Durga Puja 2026	South Kolkata
219	Lake Town Adhibasi Brinda Durga Puja 2026	North 24 Parganas
220	Lake Town Sarbojanin Durgotsav 2026	North 24 Parganas
221	Lake View Park Sarbojanin Durgotsav Samity 2026	North Kolkata
222	Lake Youth Corner Durga Puja 2026	South Kolkata
223	Machua Bazar Sarbajanik Durga Puja Samity 2026	Central Kolkata
224	Madhusudan Das Lane & Bye Lane Sarbojanin Durgotsab 2026	Howrah
225	Mahalla Sarbojanin Durgautsab Samity 2026	North Kolkata
226	Mahamayatala Sarbojanin Durgotsab 2026	South Kolkata
227	Makardah Karuri Para Sarbojanin Durgotsav 2026	Howrah
228	Maniratnam Flat Owner Association 2026	North 24 Parganas
229	Md. Ali Park Durga Puja 2026	Central Kolkata
230	Megacity Residents Puja Committee 2026	South Kolkata
231	Milan Sangha Durga Puja 2026	Howrah
232	Milon Sangha Durga Puja 2026	Hooghly
233	Mitali Kankurgachi Durga Puja 2026	North Kolkata
234	Mohan Bagan Barwari Durga Puja 2026	North Kolkata
235	Mohila Mahal Club Durga Puja 2026	South Kolkata
236	Mondal Para Sporting Club Durga Puja 2026	North Kolkata
237	Monmohan Park Sarbojanin Durgotsab 2026	Behala
238	Monohar Pukur Baisakhi Sangha 2026	South Kolkata
239	Mudiali Club Sarbojanin Durga Puja 2026	South Kolkata
240	Mukundapur Sarbojanin Durgotsav Committee 2026	South 24 Parganas
241	N.S.C. Sports Club Durga Puja 2026	South Kolkata
242	Nabanagar Badamtala Sarbojanin Durgotsab 2026	Howrah
243	Nabapally Adhibashi Brinda Durga Puja 2026	East Kolkata
244	Nabarun Sangha Durga Puja 2026	Behala
245	Nainan Para & Jogendra Basak Road Sarbojanin Shree Shree Durgapuja 2026	North Kolkata
246	Naktala Udayan Sangha Durga Puja 2026	South Kolkata
247	Nalin Sarkar Street Sarbojanin Durgotsab 2026	North Kolkata
248	Naskarpara Sarbojanin Durgotsav 2026	South Kolkata
249	Nehru Nagar Sarbojanin Durga Puja Samity 2026	Hooghly
250	Netaji Sporting Club Durga Puja 2026	East Kolkata
251	New Alipore Suruchi Sangha Durga Puja 2026	South Kolkata
252	New Market Sarbojanin Sri Sri Durga Puja 2026	Central Kolkata
253	New Santoshpur Adi Durgotsab 2026	South Kolkata
254	Nigampally, (Hakimpara) Unnayan Samity Durga Puja 2026	Other Zone
255	Nimta Boy's Athletic Club Sarbojanin Durgotsav 2026	North Kolkata
256	Nimtala Sarbojanin Durgotsab 2026	North Kolkata
257	North Tangra Durga Puja 2026	North Kolkata
258	North Tridhara Sarbojanin Durga Puja 2026	North Kolkata
259	Nutan Pally Sarbojanin Durgotsab 2026	North Kolkata
260	Oikotan Hebbal Durgotsav 2026	Other Zone
261	Paddapukur Barwari Samity 2026	South Kolkata
262	Paddapukur Youth Association Durga Puja 2026	South Kolkata
263	Palli Asar Sporting Club Durga Puja 2026	Behala
264	Palli Unnayan Samity Durga Puja 2026	Behala
265	Pallir Yubak Brinda Durga Puja 2026	Central Kolkata
266	Pally Mangal Samity Durga Puja 2026	South Kolkata
267	Panchanantala Sarbojonin Durgatsob Samity 2026	Hooghly
268	Panchanna Gram Adhibasibrinda 2026	South Kolkata
269	Pandaveswar Namupara Adhibasibrindo 2026	Other Zone
270	Panuhat Purbapara Sarbojanin Durga Puja 2026	Other Zone
271	Parnasree Club Sarbojanin Durgotsav 2026	Behala
272	Paschim Putiary Sarbojanin Nabo Durgotsav 2026	South Kolkata
273	Pathuria Ghata Pancher Palli Sarbojanin 2026	North Kolkata
274	Patipukur Sarkari Abas Sharad Utsav Committee 2026	North 24 Parganas
275	Patuli Sarbojanin Durgotsab 2026	South Kolkata
276	Peyarabagan Sarbojanin Durgotsab 2026	South Kolkata
277	Phulpukur Sarbojanin Durgotsav Samiti 2026	Hooghly
278	Picnic Sunrise Club 2026	South Kolkata
279	Pockpari Sanghasree Sarbojanin Durgotsab Puja Committee 2026	South 24 Parganas
280	Prafulla Kanan Sarbojanin Durgotsab 2026	Salt Lake
281	Pragati Sangha Durga Puja 2026	South Kolkata
282	Pragati Sangha Durgotsab Committee 2026	South Kolkata
283	Purba Kalikata Sarbojanin Durgotsav 2026	East Kolkata
284	Purbachal Residents Sarbojanin Durgotsav 2026	South Kolkata
285	Purbanchal Prabhati Sangha Durga Puja 2026	East Kolkata
286	Putiary Sarbojanin Durgotsab Committee 2026	South Kolkata
287	R.B. Sarani Sarbojanin Durgotsab Samity 2026	Hooghly
288	Radha Gobinda Mandir Durga Puja 2026	Other Zone
289	Ramesh Dutta Street Sarbojanin Durgotsab 2026	North Kolkata
290	Ramgarh Satapally Sarbojanin Durgotsav Committee 2026	South Kolkata
291	Rammohan Sammilani Durga Puja 2026	North Kolkata
292	Ranaghat Sporting Association 2026	Other Zone
293	Rashbehari Suhrid Sangha 2026	South Kolkata
294	Regent Enclave Durga Puja 2026	North 24 Parganas
295	Riya Gitanjali Housing Durga Puja 2026	North 24 Parganas
296	Roypara Barowari Durga Puja 2026	Hooghly
297	Russa Madhyapally Sarbojanin Durgotsav 2026	South Kolkata
298	Sabuj Sangha Durga Puja 2026	North 24 Parganas
299	Sadhukhan Bari Durga Puja 2026	North Kolkata
300	Sahapur Colony East Durga Puja 2026	Behala
301	Sahapur Friends Association Sarbojanin 2026	Behala
302	Sahapur Mitali Sangha Durga Puja 2026	Behala
303	Sahapur Nabashakti Sangha Durga Puja 2026	Behala
304	Sahapur Panchabatitala Sammilani Durga Puja 2026	Behala
305	Sahapur Sarbojanin Durgotsab Committee 2026	Behala
306	Sahapur Suhrid Sangha Durga Puja Committee 2026	South Kolkata
307	Salap Utsahi Sangha Durga Puja 2026	Howrah
308	Salkia Baroari Durgatsob 2026	Howrah
309	Salkia Chatra Bayam Samity Sarbojanin 2026	Howrah
310	Salkia Sadharan Durga Puja 2026	Howrah
311	Salkia Sitalatala Sarbojanin Durgotsab 2026	Howrah
312	Sammilani Durga Puja 2026	South Kolkata
313	Sammilita Lalabagan Sarbojanin Durga Puja 2026	North Kolkata
314	Sampoorna Tritiya Puja Committee 2026	North 24 Parganas
315	Sanghasree Kalighat Durga Puja 2026	South Kolkata
316	Santosh Mitra Square Durga Puja 2026	Central Kolkata
317	Santoshpur Avenue South 2026	South Kolkata
318	Santoshpur Lake Pally Durga Puja 2026	South Kolkata
319	Santoshpur Trikon Park Durgotsab 2026	South Kolkata
320	Sarkar Bagan Sammilita Sangha Durga Puja 2026	North Kolkata
321	Sater Palli Sarbojanin Durgotsav 2026	North Kolkata
322	Serampore Aat-Er Palli Durga Puja 2026	Hooghly
323	Shaktimoyee Sarbojanin Durgotsab Committee 2026	Howrah
324	Shastri Bagan Sporting Club Durgotsav Committee 2026	North 24 Parganas
325	Shibmandir Sarbojanin Durgotsab Samiti 2026	South Kolkata
326	Shibpur Sastitala Durga Puja 2026	Howrah
327	Shikarpur Kishore Sangha Club 2026	Other Zone
328	Shishu Palan Foundation 2026	Central Kolkata
329	Shyam Sunder Pallybasi Brinda 2026	Behala
330	Shyambazar Nabin Sangha Durga Puja 2026	North Kolkata
331	Siddha Happyville Cultural Committee 2026	North 24 Parganas
332	Siddha Town Cultural Committee 2026	North 24 Parganas
333	Signum Aristo Residential Puja 2026	North Kolkata
334	Sikdar Bagan Sadharan Durgotsov 2026	North Kolkata
335	Simla Sporting Club Durga Puja 2026	North Kolkata
336	Singhi Park Sarbojanin Durga Puja 2026	South Kolkata
337	Sitalatala Mahila Samity 2026	North 24 Parganas
338	Sixemes Cooperative Housing Durgotsav 2026	East Kolkata
339	SOE Residents Durga Puja 2026	North 24 Parganas
340	Sonarpur Power House Sarbojanin Durgotsab 2026	South 24 Parganas
341	Sonarpur Sarbojanin Durgotsav Puja Committee 2026	South Kolkata
342	Sovabazar Sarbojanin Durgotsav 2026	North Kolkata
343	Sree Sree Durga Puja Committee, Rabindrapally 2026	East Kolkata
344	Sreebhumi Sporting Club Durga Puja 2026	North Kolkata
345	Sreemapally Sarbojanin Durga Puja 2026	Behala
346	Sri Sri Sarbojanin Durga Puja 2026	South Kolkata
347	State Bank Park Sarbojanin Durga Puja 2026	Behala
348	Subhaspally Shaktinagar Sarbojanin Durgatsav 2026	Howrah
349	Subodh Garden Cultural & Welfare Society 2026	South 24 Parganas
350	Sujaday Club Durga Puja 2026	South 24 Parganas
351	Surya Nagar Sarbojanin Durga Puja 2026	South Kolkata
352	Swamiji Sarak Sarbojanin Durgotsab 2026	Behala
353	Tala Barowari Durgotsab 2026	North Kolkata
354	Tala Dakshin Pally Durgotsav Committee 2026	North Kolkata
355	Tala Park 15 Pally Durga Puja 2026	North Kolkata
356	Taratala Milantirtha Institute 2026	Behala
357	Telengabagan Sarbojanin Durgotsab 2026	North Kolkata
358	Tentultala Bazar Barowari Mandir Sarbojanin Durgotsab Committee 2026	Hooghly
359	Thakurpukur Sister Nivedita Multipurpose Society 2026	South 24 Parganas
360	Topkhana Sarvajanik Durga Puja 2026	Other Zone
361	Torpedo Welfare Society Durga Puja 2026	Howrah
362	Tridhara Sammilani Durga Puja 2026	South Kolkata
363	Tulipians Durgotsav 2026	South Kolkata
364	Udairampur Recreation Club 2026	South 24 Parganas
365	Udayan Kidderpore Durga Puja 2026	South Kolkata
366	Ukhra Saradapally Main Road Sarbojanin Durga Puja 2026	Other Zone
367	Ultadanga Jagarani Sangha Durga Puja 2026	North Kolkata
368	Ultadanga Pallyshree Durga Puja 2026	North Kolkata
369	Ultadanga Sangrami Durga Puja 2026	North Kolkata
370	Upohar Utsav Committee 2026	South Kolkata
371	Uttar Bantra Kumar Para Baroary Samity Durga Puja 2026	Howrah
372	Uttar Purba Baishnabghata Patuli Sarbojanin Durgotsab Committee 2026	South 24 Parganas
373	Uttar Salkia Sarbojanin Durgotsab 2026	Howrah
374	VIP Nagar Sarbojanin Durga Puja Committee 2026	South Kolkata
375	Wellington Nagarik Kalyan Samity Durga Puja 2026	Central Kolkata
376	West Ananda Nagar Youth Club 2026	Other Zone
377	Westend Park Sarbojanin Durga Puja 2026	South Kolkata
378	Windsor Greens Flat Owners Association 2026	South 24 Parganas
379	Young Citizens Club Durga Puja 2026	North Kolkata
"""

# Zone center coords and metadata mapping
ZONE_COORDS = {
    'South Kolkata': (22.5200, 88.3550, 'Kalighat / Jatin Das Park / Gariahat', 'Kalighat Auto Stand'),
    'North Kolkata': (22.5950, 88.3680, 'Shyambazar / Sovabazar', 'Shyambazar 5-Point Stand'),
    'Central Kolkata': (22.5700, 88.3620, 'MG Road / Central / Sealdah', 'College Street Auto Stand'),
    'East Kolkata': (22.5750, 88.4000, 'Salt Lake / Phoolbagan', 'Ultadanga Auto Hub'),
    'Salt Lake': (22.5850, 88.4150, 'Karunamoyee / Central Park', 'Karunamoyee Terminus Stand'),
    'Behala': (22.4980, 88.3180, 'Taratala / Behala Chowrasta', 'Behala Tram Depot Auto Point'),
    'Howrah': (22.5850, 88.3380, 'Howrah Railway & Metro', 'Howrah Station Auto Bay'),
    'Hooghly': (22.8800, 88.3900, 'Suburban Railway Line', 'Grand Trunk Road Auto Stand'),
    'South 24 Parganas': (22.4600, 88.3800, 'Kavi Subhash (New Garia)', 'Garia Station Auto Stand'),
    'North 24 Parganas': (22.6200, 88.4200, 'Dum Dum / VIP Road', 'Nagerbazar Auto Stand'),
    'Other Zone': (22.5500, 88.3600, 'Esplanade Interchange', 'Esplanade Central Stand')
}

THEMES = [
    'Grand Lighting & Architecture',
    'Contemporary Art',
    'Heritage & Traditional',
    'Social Theme',
    'Bonedi Bari'
]

lines = raw_text.strip().split('\n')
pandals = []

for line in lines:
    parts = line.split('\t')
    if len(parts) >= 3:
        num = parts[0].strip()
        name = parts[1].replace(' 2026', '').strip()
        zone = parts[2].strip()
        
        base_lat, base_lng, nearest_metro, nearest_auto = ZONE_COORDS.get(
            zone, (22.5400, 88.3500, 'Kalighat', 'Central Auto Point')
        )
        
        # Seeded jitter for natural geospatial distribution across Kolkata
        random.seed(f"{num}_{name}")
        lat_jitter = (random.random() - 0.5) * 0.035
        lng_jitter = (random.random() - 0.5) * 0.035
        
        lat = round(base_lat + lat_jitter, 5)
        lng = round(base_lng + lng_jitter, 5)
        
        # Map canonical zone
        c_zone = 'South'
        if 'North' in zone: c_zone = 'North'
        elif 'Central' in zone: c_zone = 'Central'
        elif 'East' in zone or 'Salt Lake' in zone: c_zone = 'East'
        elif 'Behala' in zone or 'South' in zone: c_zone = 'South'
        
        theme = random.choice(THEMES)
        rating = round(random.uniform(4.3, 5.0), 1)
        base_wait = random.choice([15, 20, 25, 30, 35, 40, 45, 50, 60, 75, 90])
        walk_min = random.randint(3, 20)
        vip = random.choice([True, False])
        cordon = random.choice([True, False]) if base_wait >= 40 else False
        
        pandal = {
            'id': f"p-{num}",
            'name': name,
            'zone': c_zone,
            'subZone': zone,
            'lat': lat,
            'lng': lng,
            'nearestMetro': nearest_metro,
            'metroWalkMin': walk_min,
            'nearestAutoStand': nearest_auto,
            'themeCategory': theme,
            'rating': rating,
            'baseWaitMin': base_wait,
            'peakHours': ['17:00', '18:30', '20:00', '21:30', '23:00'],
            'description': f"Celebrated {zone} landmark pandal. Famous for community cultural grandeur, exquisite lighting, and artistic immersion.",
            'famousFor': f"Unique {theme.lower()} showcasing artisanal craftsmanship and community heritage.",
            'policeCordonZone': cordon,
            'vipPassAvailable': vip,
            'entryGate': f"{name.split()[0]} Main Gate A",
            'exitGate': f"{name.split()[0]} Corridor Exit"
        }
        pandals.append(pandal)

# Write CSV
csv_path = '/Users/shreyashidas/work2/deepmind/data/kolkata_durga_puja_2026.csv'
with open(csv_path, 'w', newline='', encoding='utf-8') as f:
    writer = csv.writer(f)
    writer.writerow([
        'pandal_id', 'name', 'zone', 'sub_zone', 'lat', 'lng', 
        'nearest_metro', 'metro_walk_min', 'nearest_auto_stand', 
        'theme_category', 'rating', 'base_wait_min', 'famous_for', 
        'police_cordon_zone', 'vip_pass_available'
    ])
    for p in pandals:
        writer.writerow([
            p['id'], p['name'], p['zone'], p['subZone'], p['lat'], p['lng'],
            p['nearestMetro'], p['metroWalkMin'], p['nearestAutoStand'],
            p['themeCategory'], p['rating'], p['baseWaitMin'], p['famousFor'],
            p['policeCordonZone'], p['vipPassAvailable']
        ])

# Write JSON
json_path = '/Users/shreyashidas/work2/deepmind/data/kolkata_durga_puja_2026.json'
with open(json_path, 'w', encoding='utf-8') as f:
    json.dump(pandals, f, indent=2)

print(f"Successfully generated dataset with {len(pandals)} pandals in CSV and JSON!")
