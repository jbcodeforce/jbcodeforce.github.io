
# compute the needs for song aggregation processing in term of storage size,
# number of event processed

number_of_songs = 70000000
number_of_users = 400000000
active_users = 0.4   # percent of users using the platform on a daily basis
event_size = 20 # bytes
nb_hour_per_day=24  # of active users - WW deployment
song_length = 180  # seconds
number_of_second_user_play_song_in_a_day = 45*60 # second
length_user_session=30 * 60 # second

def logged_users_at_time_t():
    return number_of_users * active_users * length_user_session / (24 * 3600)

def likelyhood_user_listen_to_song():
    return number_of_second_user_play_song_in_a_day / (24 * 3600) * 100 
    
def active_users_playing_song_at_time_t():
    return logged_users_at_time_t() * likelyhood_user_listen_to_song()

def number_events():
    # number of song played at each second among all active user at time t
    return active_users_playing_song_at_time_t() / song_length
    
if __name__ == "__main__":
    print(f"# of active users at time t {logged_users_at_time_t()}")
    print(f"{likelyhood_user_listen_to_song()} %")
    print(f"active_users_playing_song_at_time_t: {active_users_playing_song_at_time_t()}")
    nb_evt = number_events()
    print(f"Number of event {nb_evt} per s")
    size_per_s = nb_evt * event_size # create x bytes per s
    print(f"Size per s {size_per_s} and per day {size_per_s * 3600 * 24}")
    